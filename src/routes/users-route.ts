import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        const { name, email, password } = body;
        await registerUser({ name, email, password });
        
        // Success response format
        return { data: "ok" };
      } catch (error: any) {
        // Error response format for already registered email
        if (error.message === "email sudah terdaftar") {
          set.status = 400;
          return { error: "email sudah terdaftar" };
        }
        
        // Generic error handler
        set.status = 500;
        return { error: error.message || "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/users/login",
    async ({ body, set }) => {
      try {
        const { email, password } = body;
        const result = await loginUser({ email, password });
        
        // Success response format
        return { data: result.token };
      } catch (error: any) {
        // Error response format for login failure
        if (error.message === "email atau password salah") {
          set.status = 400;
          return { error: "email atau password salah" };
        }
        
        // Generic error handler
        set.status = 500;
        return { error: error.message || "Internal Server Error" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
