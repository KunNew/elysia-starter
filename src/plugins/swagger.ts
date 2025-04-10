import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

export default (app: Elysia) =>
  app.use(
    swagger({
      path: "/docs",
      autoDarkMode: true,
      scalarVersion: "1.25.50",
      documentation: {
        info: {
          title: "Bun (🍔) API Starter Docs",
          version: "1.0.0",
          description: "API documentation for the Elysia application",
        },
        tags: [
          { name: "User", description: "User management endpoints" },
          { name: "API", description: "General API endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
          schemas: {
            User: {
              type: "object",
              properties: {
                _id: { type: "string" },
                email: { type: "string", format: "email" },
                name: { type: "string" },
                profilePicture: { type: "string" },
                role: { type: "string", enum: ["user", "admin"] },
                isActive: { type: "boolean" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
              required: ["email", "name"],
            },
            Auth: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      scalarConfig: {
        layout: "classic",
        spec: {
          url: "/docs/json",
        },
        theme: "deepSpace",
      },
    })
  );
