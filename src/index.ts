import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { getLocalIpAddress } from "../utils/ip-address";
import { connectDB } from "./config/db";
import securityPlugin from "./plugins/security";
import errorPlugin from "./plugins/error";
import authRoutes from "./routes/auth";
import protectedRoutes from "./routes/protected";
import swaggerPlugin from "./plugins/swagger";
import { staticPlugin } from "@elysiajs/static";
import * as pc from "picocolors";

// Connect to MongoDB
await connectDB();
const port = Bun.env.PORT || 3000;
const app = new Elysia()
  .use(swaggerPlugin)
  .use(errorPlugin)
  .use(securityPlugin)
  .use(
    staticPlugin({
      assets: "public",
      prefix: "",
    })
  )
  .use(authRoutes)
  .use(protectedRoutes)
  .listen(port);

const ipAddress = getLocalIpAddress();

console.log(pc.red(`🦊 Elysia is running at ${ipAddress}:${app.server?.port}`));
console.log(
  pc.greenBright(
    `📚 Swagger documentation available at ${ipAddress}:${app.server?.port}/swagger`
  )
);

// .ws("/ws", {
//   // Configure WebSocket settings for better handling of disconnections
//   websocket: {
//     idleTimeout: 30, // Close connection after 30 seconds of inactivity
//     maxPayloadLength: 16 * 1024, // 16KB max message size
//     backpressureLimit: 1024 * 1024, // 1MB buffer limit
//     closeOnBackpressureLimit: true,
//   },
//   // Handle new connections
//   open(ws) {
//     console.log("Client connected", ws.id);
//     ws.send({ type: "connection", status: "connected" });
//   },
//   // Handle connection close
//   close(ws) {
//     ws.send({ type: "disconnected", id: ws.id });
//     console.log("Client disconnected", ws.id);
//   },
// })
