const router = require("express").Router();
const {
  getBookings,
  createBooking,
  cancelBooking,
} = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getBookings);
router.post("/", verifyToken, createBooking);
router.delete("/:id", verifyToken, cancelBooking);

module.exports = router;