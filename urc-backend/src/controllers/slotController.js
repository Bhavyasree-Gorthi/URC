const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");

exports.getSlots = async (req, res) => {
  try {
    const slots = await prisma.slot.findMany({
      orderBy: { date: "asc" },
    });

    res.json({ success: true, data: slots });
  } catch (err) {
    console.error("GET SLOTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const { date, time, capacity } = req.body;

    if (!date || !time || !capacity) {
      return res.status(400).json({ message: "date, time, and capacity required" });
    }

    // Check if slot already exists for this date and time
    const existing = await prisma.slot.findUnique({
      where: { date_time: { date: new Date(date), time } },
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already exists for this date and time" });
    }

    const slotId = "slot_" + nanoid(12);

    const slot = await prisma.slot.create({
      data: {
        id: slotId,
        date: new Date(date),
        time,
        capacity: parseInt(capacity),
        booked: 0,
      },
    });

    console.log("SLOT CREATED:", slot);

    res.json({ success: true, slot });
  } catch (err) {
    console.error("CREATE SLOT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { capacity, disabled, holiday } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: "slotId required" });
    }

    const updateData = {};
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (disabled !== undefined) updateData.disabled = disabled;
    if (holiday !== undefined) updateData.holiday = holiday;

    const slot = await prisma.slot.update({
      where: { id: slotId },
      data: updateData,
    });

    console.log("SLOT UPDATED:", slot);

    res.json({ success: true, slot });
  } catch (err) {
    console.error("UPDATE SLOT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    if (!slotId) {
      return res.status(400).json({ message: "slotId required" });
    }

    // Check if slot has any bookings
    const bookings = await prisma.booking.findMany({
      where: { slotId },
    });

    if (bookings.length > 0) {
      return res.status(400).json({ message: "Cannot delete slot with existing bookings" });
    }

    await prisma.slot.delete({
      where: { id: slotId },
    });

    console.log("SLOT DELETED:", slotId);

    res.json({ success: true, message: "Slot deleted successfully" });
  } catch (err) {
    console.error("DELETE SLOT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};