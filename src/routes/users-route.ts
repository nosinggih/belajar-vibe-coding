import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" }).post(
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
);
