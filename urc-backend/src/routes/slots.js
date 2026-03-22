const router = require("express").Router();
const { getSlots, createSlot, updateSlot, deleteSlot } = require("../controllers/slotController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

// Get all slots (public, no auth required)
router.get("/", getSlots);

// Admin endpoints
router.post("/", verifyToken, isAdmin, createSlot);
router.patch("/:slotId", verifyToken, isAdmin, updateSlot);
router.delete("/:slotId", verifyToken, isAdmin, deleteSlot);

module.exports = router;