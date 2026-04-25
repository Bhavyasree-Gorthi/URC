const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("JWT_SECRET:", !!process.env.JWT_SECRET);

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow Vercel deployments
      if (origin && origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");
const noticeRoutes = require("./routes/notices");

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// 404 handler (helps debugging)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Handle port-in-use error gracefully
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Kill the process and retry.`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Clean shutdown on Ctrl+C / nodemon restart
process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());