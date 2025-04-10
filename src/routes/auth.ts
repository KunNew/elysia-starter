import { Elysia, t } from "elysia";
import { authSchema } from "../schemas/authSchema";
import { Login } from "../controllers/auth";
import { createUser } from "../controllers/user";

export default (app: Elysia) =>
  app.group("/api/v1/auth", (app) => 
    app.use(authSchema)
      .post("/login", Login, {
        tags: ["Auth"],
        body: t.Object({
          email: t.String({ format: "email", maxLength: 256, default: "super@email.com" }),
          password: t.String({ maxLength: 256, default: "superpwd@2025" }),
        }),
      })
      .post("/register", createUser, {
        tags: ["Auth"],
        body: t.Object({
          name: t.String(),
          email: t.String({ format: "email" }),
          password: t.String(),
          profilePicture: t.Optional(t.String()),
          role: t.Optional(t.Union([t.Literal("user"), t.Literal("admin")])),
          isActive: t.Optional(t.Boolean()),
        }),
      })
  );
