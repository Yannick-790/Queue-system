import http from "http";
import { Server } from "socket.io";

import app from "./app";

import { initQueueGateway } from "./websocket/queue.gateway";
import { initializeDisplayGateway } from "./websocket/display.gateway";

// ============================================================
// PORT
// ============================================================

const PORT = process.env.PORT || 5000;

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer(app);

// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },

  transports: ["websocket", "polling"],
});

// ============================================================
// INITIALIZE WEBSOCKET GATEWAYS
// ============================================================

// Queue operations
initQueueGateway(io);

// Public displays / desk displays / live queue updates
initializeDisplayGateway(io);

// ============================================================
// START SERVER
// ============================================================

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );

  console.log(
    `🔌 Socket.IO running on port ${PORT}`
  );
});