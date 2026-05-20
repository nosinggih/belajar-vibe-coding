import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

/**
 * Registers a new user.
 * Hashes password using Bun's built-in bcrypt and saves to the database.
 * Throws an error if the email is already registered.
 */
export async function registerUser(payload: RegisterUserPayload) {
  const { name, email, password } = payload;

  // 1. Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // 2. Hash password with Bun's built-in bcrypt
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10, // standard cost for bcrypt
  });

  // 3. Insert user into database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true };
}

/**
 * Authenticates a user and generates a session token.
 * Throws an error if the email or password is incorrect.
 */
export async function loginUser(payload: LoginUserPayload) {
  const { email, password } = payload;

  // 1. Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new Error("email atau password salah");
  }

  // 2. Verify password with Bun's built-in bcrypt verify
  const isMatch = await Bun.password.verify(password, user.password);
  if (!isMatch) {
    throw new Error("email atau password salah");
  }

  // 3. Generate a secure random UUID token
  const token = crypto.randomUUID();

  // 4. Save session token to database
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return { token };
}

/**
 * Retrieves the current logged in user based on their session token.
 * Throws "unauthorized" error if the session token is invalid or expired.
 */
export async function getCurrentUser(token: string) {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!result) {
    throw new Error("unauthorized");
  }

  return result;
}

