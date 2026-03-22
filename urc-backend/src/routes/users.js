const router = require("express").Router();
const { getUsers, updateUserStatus } = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getUsers);
router.patch("/:userId", verifyToken, isAdmin, updateUserStatus);

module.exports = router;