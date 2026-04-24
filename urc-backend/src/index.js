
const express = require("express");
const cors = require("cors");

// Load .env only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Debug check (important for deployment)
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

const app = express();

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");
const noticeRoutes = require("./routes/notices");

// API routes (clean structure)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notices", noticeRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// Global error handler (important)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
