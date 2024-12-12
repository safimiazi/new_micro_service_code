import app from "@/app";
import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { startConsumer } from "./consumers/emailConsumer";
// import { InitTelegramBot } from "./utility/telegram/telegram_bot";

export const Server = http.createServer(app);
const io: SocketIOServer = require("socket.io")(Server, {
  cors: {
    origin: "http://192.168.5.76:5173", // Replace with your React app's origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

Server.listen(5000, () => {
  console.log("server listening on port " + 5000);
});
// InitTelegramBot();

io.on("connection", (socket: Socket) => {
  const user = socket.handshake.query.id ? socket.handshake.query : null;

  if (user) {
    console.log(`⚡: ${user.name} just connected!`);
    socket.join(user.id);
  }

  socket.on("sms_config", (e) => {
    console.log(`⚡: `, e);
    io.to("nahid")
      .to("ff119376-5aff-439a-abe6-1682e4ee72cb")
      .emit("sms_config_c", e);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

export default io;
