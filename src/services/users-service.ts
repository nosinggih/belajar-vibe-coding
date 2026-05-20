import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface RegisterUserPayload {
  name: string;
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
