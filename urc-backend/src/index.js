const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);

const app = express();

app.use(cors());
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
