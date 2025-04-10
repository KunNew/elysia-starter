import { Elysia } from "elysia";
import User from "../models/User";

export default (app: Elysia) =>
  // @ts-expect-error This remains valid after JWT is implemented.
  app.derive(async ({ jwt, headers, request, set }) => {
    // TODO: Fix me later.
    if (request.url.includes("/docs")) {
      return;
    }

    const token = await jwt.verify(headers.authorization?.split(" ")[1]);

    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized - Invalid token");
    }

    // Find user in database using ID from token
    const user = (await User.findById(token.id).select(
      "-password"
    )) as User.Schema;

    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized - User not found");
    }

    return {
      user,
    };
  });
