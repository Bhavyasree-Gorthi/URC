const router = require("express").Router();
const {
  getBookings,
  getBookingHistory,
  createBooking,
  cancelBooking,
  completeBooking,
} = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getBookings);
router.get("/history", verifyToken, isAdmin, getBookingHistory);
router.post("/", verifyToken, createBooking);
router.patch("/:id/complete", verifyToken, isAdmin, completeBooking);
router.delete("/:id", verifyToken, cancelBooking);

module.exports = router;
