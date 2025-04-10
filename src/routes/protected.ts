import { Elysia } from "elysia";
import authPlugin from "../plugins/authenticate";
import { userRoutes } from "./user";

export default (app: Elysia) =>
  app.group("/api/v1", (app) =>
    app.use(userRoutes)
  );
