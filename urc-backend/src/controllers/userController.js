const prisma = require("../config/prisma");

exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  res.json({ success: true, data: users });
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    let { status } = req.body;
    
    if (!userId || !status) {
      return res.status(400).json({ message: "userId and status required" });
    }

    // Convert to uppercase for consistency with Prisma enum
    status = status.toUpperCase();

    const validStatuses = ["PENDING", "ACTIVE", "DISABLED", "SUSPENDED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, name: true, email: true, status: true }
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};