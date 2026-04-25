const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / curl
      if (!origin) return callback(null, true);

      // Allow known origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel deployments
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

// ✅ Handle preflight
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");
const noticeRoutes = require("./routes/notices");

// ✅ ONLY use /api prefix (IMPORTANT)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notices", noticeRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// ✅ 404 handler (helps debugging)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});