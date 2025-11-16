import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import communityRoutes from "./routes/community.route.js";
import postRoutes from "./routes/post.route.js";
import newsRoutes from "./routes/news.route.js";
import contestRoutes from "./routes/contest.route.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Allowed frontend origins (local + production)
const allowedOrigins = [
  "http://localhost:5173"
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Spektra API is running and connected to frontend!");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contests", contestRoutes);

// ✅ HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ WebSocket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (communityId) => {
    socket.join(communityId);
    console.log(`User ${socket.id} joined room: ${communityId}`);
  });

  socket.on("leaveRoom", (communityId) => {
    socket.leave(communityId);
    console.log(`User ${socket.id} left room: ${communityId}`);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.communityId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Start server + connect DB
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
