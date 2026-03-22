const router = require("express").Router();
const {
  getNotices,
  createNotice,
  deleteNotice,
} = require("../controllers/noticeController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", getNotices);
router.post("/", verifyToken, isAdmin, createNotice);
router.delete("/:id", verifyToken, isAdmin, deleteNotice);

module.exports = router;
