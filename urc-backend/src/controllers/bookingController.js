const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");

function getIndiaNowParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const value = {};
  for (const part of parts) {
    if (part.type !== "literal") value[part.type] = part.value;
  }

  return {
    date: `${value.year}-${value.month}-${value.day}`,
    hour: Number(value.hour || 0),
    minute: Number(value.minute || 0),
  };
}

function getSlotEndMinutes(timeRange) {
  const endLabel = String(timeRange || "").split(" - ")[1];
  if (!endLabel) return Number.MAX_SAFE_INTEGER;

  const match = endLabel.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return (hour * 60) + minute;
}

async function autoCompleteExpiredBookings() {
  const { date: todayIndia, hour: hourIndia, minute: minuteIndia } = getIndiaNowParts();
  const nowMinutes = (hourIndia * 60) + minuteIndia;

  // Only bookings for today-or-earlier can possibly be expired — no need to
  // pull every ACTIVE booking in the system on every single request.
  const activeBookings = await prisma.booking.findMany({
    where: {
      status: "ACTIVE",
      slot: { date: { lte: new Date(`${todayIndia}T23:59:59`) } },
    },
    select: { id: true, slot: { select: { date: true, time: true } } },
  });

  const expiredIds = activeBookings
    .filter((booking) => {
      const bookingDate = booking.slot?.date instanceof Date
        ? booking.slot.date.toISOString().slice(0, 10)
        : String(booking.slot?.date || "").slice(0, 10);

      return bookingDate < todayIndia || (bookingDate === todayIndia && nowMinutes >= getSlotEndMinutes(booking.slot?.time));
    })
    .map((booking) => booking.id);

  if (expiredIds.length > 0) {
    await prisma.booking.updateMany({
      where: { id: { in: expiredIds } },
      data: { status: "COMPLETED" },
    });
  }
}

exports.getBookings = async (req, res) => {
  try {
    await autoCompleteExpiredBookings();

    // Only pull the fields the frontend actually reads (user.name/email/cardId,
    // slot.date/time), and cap to the last 45 days / 500 rows so the payload
    // stays small and bounded no matter how large the table grows over time.
    // Older records are still available via GET /bookings/history.
    const cutoff = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);

    const bookings = await prisma.booking.findMany({
      where: { createdAt: { gte: cutoff } },
      include: {
        user: { select: { name: true, email: true, cardId: true, allowedCategory: true } },
        slot: { select: { date: true, time: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    if (err?.code === "P1001") {
      return res.status(503).json({ message: "Database connection unavailable" });
    }

    res.status(500).json({ error: err.message });
  }
};

// On-demand full history — not called on every dashboard load, only when
// an admin explicitly wants older records (e.g. a "Load full history" button
// or a reports page). Keeps the default getBookings fetch cheap.
exports.getBookingHistory = async (req, res) => {
  try {
    const { from, to } = req.query;

    const where = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, cardId: true, allowedCategory: true } },
        slot: { select: { date: true, time: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 2000,
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
    const CLOSING_SLOT_TIME = "4:00 PM - 5:00 PM";
    const userId = req.user.userId;
    const { slotId, category } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { allowedCategory: true },
    });
    const { date: todayIndia, hour: hourIndia, minute: minuteIndia } = getIndiaNowParts();
    const slotDate = slot?.date instanceof Date
      ? slot.date.toISOString().slice(0, 10)
      : String(slot?.date || "").slice(0, 10);
    const slotExpiredForToday = slotDate === todayIndia && ((hourIndia * 60) + minuteIndia) >= getSlotEndMinutes(slot?.time);

    const categoryAllowed =
      user?.allowedCategory === "BOTH"
        ? ["GROCERY", "LIQUOR_ONLY", "GROCERY_AND_LIQUOR"].includes(category)
        : user?.allowedCategory === "GROCERY_ONLY"
          ? category === "GROCERY"
          : user?.allowedCategory === "LIQUOR_ONLY"
            ? category === "LIQUOR_ONLY"
            : false;

    if (!slot || slot.disabled || slot.time === CLOSING_SLOT_TIME) {
      return res.status(400).json({ message: "Slot closed" });
    }

    if (slotExpiredForToday) {
      return res.status(400).json({ message: "Slot time already completed" });
    }

    if (!categoryAllowed) {
      return res.status(403).json({ message: "This category is not allowed for your account" });
    }

    if (slot.booked >= slot.capacity) {
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

exports.completeBooking = async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "ACTIVE") {
      return res.status(400).json({ message: "Only active bookings can be completed" });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    res.json({ success: true });
  } catch (err) {
    if (err?.code === "P1001") {
      return res.status(503).json({ message: "Database connection unavailable" });
    }

    res.status(500).json({ error: err.message });
  }
};
