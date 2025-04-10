import Elysia, { t } from "elysia";
import {
  createUser,
  getUser,
  getUsers,
  me,
  deleteUser,
  updateUser,
} from "../controllers/user";

// Group all user routes
export const userRoutes = (app: Elysia) =>
  app.group("/users", (app) =>
    app
      // Get all users
      .get("/", getUsers, {
        query: t.Object({
          page: t.Number({ default: 1 }),
          pageSize: t.Number({ default: 20 }),
          search: t.Optional(t.String()),
        }),
        tags: ["User"],
      })
      // Get current user
      .get("/me", me, {
        tags: ["User"],
      })
      // Get specific user
      .get("/:id", getUser, {
        params: t.Object({
          id: t.String(),
        }),
        tags: ["User"],
      })
      // Create user
      .post("/", createUser, {
        body: t.Object({
          name: t.String({ default: "super" }),
          email: t.String({ default: "super@email.com" }),
          password: t.String({ default: "superpwd@2025" }),
          profilePicture: t.Optional(t.File({
           format: 'image/*',

          })),
          role: t.Optional(t.Union([t.Literal("user"), t.Literal("admin")])),
          isActive: t.Optional(t.Boolean()),
        }),
        detail: {
          tags: ["User"],
       
        },
      })
      // Update user
      .put("/:id", updateUser, {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          name: t.String(),
          email: t.String(),
          password: t.String(),
          profilePicture: t.Optional(t.String()),
          role: t.Optional(t.Union([t.Literal("user"), t.Literal("admin")])),
          isActive: t.Optional(t.Boolean()),
        }),
        tags: ["User"],
      })
      // Delete user
      .delete("/:id", deleteUser, {
        params: t.Object({
          id: t.String(),
        }),
        tags: ["User"],
      })
  );
