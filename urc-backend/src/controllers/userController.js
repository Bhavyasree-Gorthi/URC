const prisma = require("../config/prisma");

exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      regiment: true,
      cardId: true,
      role: true,
      status: true,
      allowedCategory: true,
    },
  });

  res.json({ success: true, data: users });
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    let { status, allowedCategory } = req.body;
    
    if (!userId || (status === undefined && allowedCategory === undefined)) {
      return res.status(400).json({ message: "userId and at least one update field required" });
    }

    const data = {};

    if (status !== undefined) {
      status = status.toUpperCase();
      const validStatuses = ["PENDING", "ACTIVE", "DISABLED", "SUSPENDED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      data.status = status;
    }

    if (allowedCategory !== undefined) {
      allowedCategory = allowedCategory.toUpperCase();
      const validCategories = ["GROCERY_ONLY", "LIQUOR_ONLY", "BOTH"];
      if (!validCategories.includes(allowedCategory)) {
        return res.status(400).json({ message: "Invalid allowed category" });
      }
      data.allowedCategory = allowedCategory;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        regiment: true,
        cardId: true,
        status: true,
        allowedCategory: true,
      }
    });

    res.json({ success: true, user });
  } catch (err) {
    console.error("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
