import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { t } from "elysia";
import cors from "@elysiajs/cors";

export default (app: Elysia) =>
  app.use(cors()).use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET as string,
      schema: t.Object({
        id: t.String()
      }),
      exp: Bun.env.JWT_EXPIRES_IN,
    })
  );
