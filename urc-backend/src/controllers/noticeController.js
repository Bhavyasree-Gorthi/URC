const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");

exports.getNotices = async (_req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: notices });
  } catch (err) {
    console.error("GET NOTICES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "Notice message is required" });
    }

    const notice = await prisma.notice.create({
      data: {
        id: `notice_${nanoid(12)}`,
        message,
      },
    });

    res.json({ success: true, data: notice });
  } catch (err) {
    console.error("CREATE NOTICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notice.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE NOTICE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
