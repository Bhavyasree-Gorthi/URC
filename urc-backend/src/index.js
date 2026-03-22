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

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/slots", slotRoutes);
app.use("/bookings", bookingRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
