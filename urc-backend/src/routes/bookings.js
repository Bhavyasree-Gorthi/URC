const router = require("express").Router();
const {
  getBookings,
  createBooking,
  cancelBooking,
  completeBooking,
} = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getBookings);
router.post("/", verifyToken, createBooking);
router.patch("/:id/complete", verifyToken, isAdmin, completeBooking);
router.delete("/:id", verifyToken, cancelBooking);

module.exports = router;
