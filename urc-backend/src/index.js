const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/slots", require("./routes/slots"));
app.use("/bookings", require("./routes/bookings"));

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));