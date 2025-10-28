// import express from 'express';
// import 'dotenv/config'; 
// import cookieParser from 'cookie-parser';

// import authRoutes from './routes/auth.route.js';
// import userRoutes from './routes/user.route.js';
// import chatRoutes from './routes/chat.route.js';
// import { connectDB } from './lib/db.js';
// import communityRoutes from "./routes/community.route.js";
// import postRoutes from "./routes/post.route.js";
// import newsRoutes from "./routes/news.route.js";
// import contestRoutes from "./routes/contest.route.js";
// import path from 'path';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const PORT = process.env.PORT || 5001;

// const __dirname = path.resolve();

// app.use(cors({
//   origin: [
//     "http://localhost:5173",          // Local frontend
//     "https://yourdomain.com"          // Production frontend
//   ],
//   credentials: true, // ✅ send cookies
// }));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.get("/", (req, res) => {
//   res.send("API is working!");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/chat", chatRoutes); 
// app.use("/api/communities", communityRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/news", newsRoutes);
// app.use("/api/contests", contestRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   })
// }

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", credentials: true },
// });

// // Socket.io real-time chat
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinRoom", (communityId) => {
//     socket.join(communityId);
//     console.log(`User ${socket.id} joined room: ${communityId}`);
//   });

//   socket.on("leaveRoom", (communityId) => {
//     socket.leave(communityId);
//     console.log(`User ${socket.id} left room: ${communityId}`);
//   });

//   socket.on("sendMessage", (message) => {
//     io.to(message.communityId).emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Start server and connect DB
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });
import express from 'express';
import 'dotenv/config'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import communityRoutes from "./routes/community.route.js";
import postRoutes from "./routes/post.route.js";
import newsRoutes from "./routes/news.route.js";
import contestRoutes from "./routes/contest.route.js";

// DB
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",     // for local frontend
    "https://yourdomain.com"     // for production
  ],
  credentials: true, // allow cookies
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Routes
app.get("/api", (req, res) => {
  res.send("API is working!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes); 
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contests", contestRoutes);

// ✅ Serve React build files (for production)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ✅ Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "https://spektra-xu5b.onrender.com"], credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start server and connect DB
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDB();
});
