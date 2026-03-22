const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");

exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, slot: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    if (err?.code === "P1001") {
      return res.status(503).json({ message: "Database connection unavailable" });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { slotId, category } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot || slot.booked >= slot.capacity) {
      return res.status(400).json({ message: "Slot full" });
    }

    const existing = await prisma.booking.findFirst({
      where: { userId, slotId },
    });

    if (existing) {
      return res.status(400).json({ message: "Already booked" });
    }

    const bookingId = "bk_" + nanoid(12);
    const tokenNo = "TKN-" + Date.now();

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        userId,
        slotId,
        category,
        tokenNo,
      },
    });

    await prisma.slot.update({
      where: { id: slotId },
      data: { booked: { increment: 1 } },
    });

    res.json({ success: true, booking });

  } catch (err) {
    if (err?.code === "P1001") {
      return res.status(503).json({ message: "Database connection unavailable" });
    }

    if (err.code === "P2002") {
      return res.status(400).json({ message: "Booking already exists for this slot" });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    await prisma.slot.update({
      where: { id: booking.slotId },
      data: { booked: { decrement: 1 } },
    });

    res.json({ success: true });

  } catch (err) {
    if (err?.code === "P1001") {
      return res.status(503).json({ message: "Database connection unavailable" });
    }

    res.status(500).json({ error: err.message });
  }
};
