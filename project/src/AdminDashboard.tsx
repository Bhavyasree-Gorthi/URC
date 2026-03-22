// AdminDashboard.tsx
// Full admin dashboard panel — Overview, Slot Manager, User Manager.
// Imported and rendered by App.tsx when the logged-in user has role === "admin".

import { useState, useCallback, useRef } from "react";
import API from "./services/api";
import { useApp } from "./context";

const SLOT_TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

function nd(value: any) {
  if (!value) return "";
  if (typeof value === "string") {
    const isoMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toISOString().split("T")[0];
}

function ns(value: any) {
  return String(value || "").toLowerCase();
}

function bookingCategoryLabel(value: any) {
  if (value === "GROCERY") return "Grocery";
  if (value === "LIQUOR_ONLY") return "Liquor Only";
  if (value === "GROCERY_AND_LIQUOR") return "Grocery + Liquor";
  return String(value || "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared refresh helper — re-fetches slots AND users, updates both contexts.
// Pass updateSlots and updateUsers from useApp().
// ─────────────────────────────────────────────────────────────────────────────
async function refreshAll(
  updateSlots: (s: any[]) => void,
  updateUsers: (u: any[]) => void,
  updateBookings: (b: any[]) => void
) {
  try {
    const [sRes, bRes, uRes] = await Promise.all([API.get("/slots"), API.get("/bookings"), API.get("/users")]);
    updateSlots(sRes.data.data);
    updateBookings(bRes.data.data);
    updateUsers(uRes.data.data);
  } catch (e) {
    console.error("refreshAll failed", e);
  }
}

// ─────────────────────────────────────────────
// Overview — shown on the "admin-dashboard" page
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const { bookings: rawBookings, slots, users: rawUsers, notices, updateNotices, showToast } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [showActiveTokens, setShowActiveTokens] = useState(false);
  const [newNotice, setNewNotice] = useState("");

  const bookings = rawBookings.map((b: any) => ({
    ...b,
    date: nd(b.date || b.slot?.date),
    time: b.time || b.slot?.time || "",
    status: ns(b.status),
    category: bookingCategoryLabel(b.category),
  }));
  const users = rawUsers.map((u: any) => ({
    ...u,
    status: ns(u.status),
  }));

  const tb = bookings.filter((b: any) => b.date === today);
  const tc = slots
    .filter((s: any) => nd(s.date) === today)
    .reduce((a: any, s: any) => a + s.capacity, 0);
  const tb2 = slots
    .filter((s: any) => nd(s.date) === today)
    .reduce((a: any, s: any) => a + s.booked, 0);
  const fp = tc ? Math.round((tb2 / tc) * 100) : 0;
  const activeBookings = bookings.filter((b: any) => b.status === "active");

  const addNotice = async () => {
    const message = newNotice.trim();
    if (!message) {
      showToast("Enter a notice message", "error");
      return;
    }

    try {
      const res = await API.post("/notices", { message });
      updateNotices((prev: any[]) => [res.data.data, ...prev]);
      setNewNotice("");
      showToast("Notice posted", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to post notice", "error");
    }
  };

  const removeNotice = async (id: string) => {
    try {
      await API.delete(`/notices/${id}`);
      updateNotices((prev: any[]) => prev.filter((notice: any) => notice.id !== id));
      showToast("Notice removed", "warning");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to remove notice", "error");
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <h1
        style={{
          fontSize: 23,
          fontWeight: 800,
          margin: "0 0 4px",
          color: "var(--text)",
        }}
      >
        Admin Overview
      </h1>
      <p
        style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 13 }}
      >
        Real-time system metrics for 4213 URC NCC
      </p>

      <div
        style={{
          background: "var(--card)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          boxShadow: "var(--shadow)",
          borderLeft: "4px solid #c9a84c",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 3 }}>
              Notice Board
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Post updates that all users can see on their dashboard
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2B" }}>
            {notices.length} notice{notices.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <input
            value={newNotice}
            onChange={(e: any) => setNewNotice(e.target.value)}
            placeholder="Post an announcement for users"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "12px 14px",
              border: "2px solid var(--border)",
              borderRadius: 12,
              fontSize: 14,
              outline: "none",
              color: "var(--text)",
              background: "var(--bg)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          />
          <button
            onClick={addNotice}
            style={{
              background: "#1F3D2B",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 18px",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 700,
            }}
          >
            Post Notice
          </button>
        </div>

        {notices.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            No notices posted yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notices.slice(0, 6).map((notice: any) => (
              <div
                key={notice.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "flex-start",
                  background: "rgba(201,168,76,0.08)",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                    {notice.message}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>
                    {notice.createdAt ? new Date(notice.createdAt).toLocaleString("en-IN") : ""}
                  </div>
                </div>
                <button
                  onClick={() => removeNotice(notice.id)}
                  style={{
                    background: "none",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 13,
          marginBottom: 24,
        }}
      >
        {[
          { l: "Today's Bookings", v: tb.length, i: "📅", c: "#1F3D2B" },
          { l: "Total Users", v: users.length, i: "👥", c: "#1e40af" },
          {
            l: "Pending Approval",
            v: users.filter((u: any) => u.status === "pending").length,
            i: "⏳",
            c: "#92400e",
          },
          {
            l: "Active Tokens",
            v: bookings.filter((b: any) => b.status === "active").length,
            i: "✅",
            c: "#065f46",
          },
        ].map((s: any) => (
          <div
            key={s.l}
            onClick={s.l === "Active Tokens" ? () => setShowActiveTokens(true) : undefined}
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: "19px 17px",
              boxShadow: "var(--shadow)",
              cursor: s.l === "Active Tokens" ? "pointer" : "default",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 7 }}>{s.i}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>
              {s.v}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* ── Slot Fill Rate ── */}
      <div
        style={{
          background: "var(--card)",
          borderRadius: 14,
          padding: 20,
          marginBottom: 18,
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 9,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: "var(--text)",
              fontSize: 13,
            }}
          >
            Today's Slot Fill Rate
          </span>
          <span
            style={{
              fontWeight: 700,
              color: "var(--text)",
              fontSize: 13,
            }}
          >
            {tb2}/{tc}
          </span>
        </div>
        <div
          style={{
            height: 9,
            background: "#e5e7eb",
            borderRadius: 7,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${fp}%`,
              background:
                fp > 80 ? "#ef4444" : fp > 50 ? "#f59e0b" : "#22c55e",
              borderRadius: 7,
              transition: "width 0.5s",
            }}
          />
        </div>
        <div
          style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}
        >
          {fp}% filled
        </div>
      </div>

      {/* ── Bookings by Category ── */}
      <div
        style={{
          background: "var(--card)",
          borderRadius: 14,
          padding: 20,
          boxShadow: "var(--shadow)",
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Bookings by Category
        </h3>
        {["Grocery", "Liquor Only", "Grocery + Liquor"].map(
          (c: any, i: any) => {
            const cnt = bookings.filter((b: any) => b.category === c).length;
            const pct = bookings.length
              ? Math.round((cnt / bookings.length) * 100)
              : 0;
            return (
              <div key={c} style={{ marginBottom: 13 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text)" }}>
                    {c}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {cnt}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#e5e7eb",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: ["#1F3D2B", "#c9a84c", "#1e40af"][i],
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>

      {showActiveTokens && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowActiveTokens(false)}
        >
          <div
            onClick={(e: any) => e.stopPropagation()}
            style={{
              background: "var(--card)",
              borderRadius: 18,
              width: "100%",
              maxWidth: 760,
              maxHeight: "80vh",
              overflow: "auto",
              padding: 24,
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 4px", color: "var(--text)", fontSize: 18 }}>
                  Active Tokens
                </h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>
                  Users who currently have active bookings
                </p>
              </div>
              <button
                onClick={() => setShowActiveTokens(false)}
                style={{
                  border: "none",
                  background: "#f3f4f6",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  color: "#111827",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {activeBookings.length === 0 ? (
              <div
                style={{
                  padding: "28px 10px",
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: 13,
                }}
              >
                No active bookings found
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeBookings.map((b: any) => (
                  <div
                    key={b.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(160px,1.3fr) minmax(110px,1fr) minmax(100px,1fr) minmax(120px,1fr) minmax(110px,1fr)",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: 3,
                        }}
                      >
                        {b.user?.name || b.userId}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {b.user?.email || "No email"}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{b.date}</div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{b.time || "-"}</div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{b.category}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>
                      {b.tokenNo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Slot Manager — "admin-slots" page
// Admin can view, add, edit capacity, enable/disable slots.
// Slots added here are immediately reflected in the user BookSlot view
// because both read from the shared context (slots state in App.tsx).
// ─────────────────────────────────────────────
export function AdminSlots() {
  const { slots, updateSlots, updateUsers, updateBookings, showToast } = useApp();
  const todayStr = new Date().toISOString().split("T")[0];
  const [selDate, setSelDate] = useState(todayStr);
  const [editSlot, setEditSlot] = useState<any>(null);
  const [newCap, setNewCap] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: todayStr,
    time: "",
    capacity: "20",
  });

  const doRefresh = useCallback(async () => {
    await refreshAll(updateSlots, updateUsers, updateBookings);
  }, [updateSlots, updateUsers, updateBookings]);

  const normalizedSelDate = nd(selDate);
  const normalizedNewSlotDate = nd(newSlot.date);

  // Date tabs = all dates that already have slots UNION the currently selected date
  // so a newly-added date is visible immediately without a page reload.
  const existingDates = [...new Set(slots.map((s: any) => nd(s.date)).filter(Boolean))] as string[];
  const allDates = [...new Set([...existingDates, normalizedSelDate])].sort().slice(0, 30);
  const dSlots = slots.filter((s: any) => nd(s.date) === normalizedSelDate);
  const takenTimes = new Set(
    slots
      .filter((s: any) => nd(s.date) === normalizedNewSlotDate)
      .map((s: any) => s.time)
  );

  // ── Create a new slot via API then refresh context ──
  const handleCreateSlot = async () => {
    if (!newSlot.date || !newSlot.time || !newSlot.capacity) {
      showToast("Please fill all fields", "error");
      return;
    }
    const duplicateSlot = slots.find(
      (s: any) => nd(s.date) === normalizedNewSlotDate && s.time === newSlot.time
    );
    if (duplicateSlot) {
      showToast(
        `A slot for ${normalizedNewSlotDate} at ${newSlot.time} already exists. Choose a different time.`,
        "error"
      );
      return;
    }
    try {
      await API.post("/slots", {
        date: normalizedNewSlotDate,
        time: newSlot.time,
        capacity: parseInt(newSlot.capacity),
      });
      setSelDate(normalizedNewSlotDate);
      setNewSlot({ date: todayStr, time: "", capacity: "20" });
      setShowAddForm(false);
      showToast("Slot created! Visible to users now ✅", "success");
      await doRefresh();
    } catch (err: any) {
      const message = err.response?.data?.message;
      const code = err.response?.data?.code;
      const isDuplicate =
        code === "P2002" ||
        (typeof message === "string" &&
          (message.includes("already exists") ||
            message.includes("Unique constraint failed") ||
            message.includes("P2002")));

      showToast(
        isDuplicate
          ? `A slot for ${normalizedNewSlotDate} at ${newSlot.time} already exists. Choose a different time.`
          : message || "Failed to create slot",
        "error"
      );
    }
  };

  const handleToggleSlot = async (s: any) => {
    try {
      await API.patch(`/slots/${s.id}`, { disabled: !s.disabled });
      showToast(s.disabled ? "Slot enabled" : "Slot disabled", "success");
      await doRefresh();
    } catch {
      showToast("Slot update failed", "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!editSlot) return;
    try {
      await API.patch(`/slots/${editSlot.id}`, {
        capacity: parseInt(newCap) || editSlot.capacity,
      });
      setEditSlot(null);
      showToast("Slot updated!", "success");
      await doRefresh();
    } catch {
      showToast("Slot update failed", "error");
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 23,
              fontWeight: 800,
              margin: "0 0 4px",
              color: "var(--text)",
            }}
          >
            Slot Manager
          </h1>
          <p style={{ color: "var(--muted)", margin: "0", fontSize: 13 }}>
            Control capacity and availability per date
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: "#1F3D2B",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          + Add Slot
        </button>
      </div>

      {/* ── Date Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {allDates.map((d: any) => (
          <button
            key={d}
            onClick={() => setSelDate(d)}
            style={{
              padding: "6px 13px",
              borderRadius: 18,
              border: "2px solid",
              borderColor: selDate === d ? "#1F3D2B" : "var(--border)",
              background: selDate === d ? "#1F3D2B" : "var(--card)",
              color: selDate === d ? "#fff" : "var(--text)",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {new Date(d).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
          </button>
        ))}
      </div>

      {/* ── Slots Table ── */}
      <div
        style={{
          background: "var(--card)",
          borderRadius: 14,
          overflow: "auto",
          boxShadow: "var(--shadow)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 520,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {[
                "Time",
                "Capacity",
                "Booked",
                "Available",
                "Fill",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 13px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dSlots.map((s: any, i: any) => {
              const rem = s.capacity - s.booked;
              const pct = Math.round((s.booked / s.capacity) * 100);
              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom:
                      i < dSlots.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 13px",
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  >
                    {s.time}
                  </td>
                  <td
                    style={{
                      padding: "12px 13px",
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {s.capacity}
                  </td>
                  <td
                    style={{
                      padding: "12px 13px",
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {s.booked}
                  </td>
                  <td
                    style={{
                      padding: "12px 13px",
                      color: rem > 0 ? "#16a34a" : "#ef4444",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {rem}
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 55,
                          height: 5,
                          background: "#e5e7eb",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background:
                              pct > 80
                                ? "#ef4444"
                                : pct > 50
                                ? "#f59e0b"
                                : "#22c55e",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{ fontSize: 11, color: "var(--muted)" }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <span
                      style={{
                        background: s.disabled ? "#fee2e2" : "#dcfce7",
                        color: s.disabled ? "#991b1b" : "#166534",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 18,
                      }}
                    >
                      {s.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => {
                          setEditSlot(s);
                          setNewCap(s.capacity);
                        }}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 7,
                          padding: "5px 10px",
                          color: "#166534",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleSlot(s)}
                        style={{
                          background: s.disabled ? "#f0fdf4" : "#fef2f2",
                          border: s.disabled
                            ? "1px solid #bbf7d0"
                            : "1px solid #fecaca",
                          borderRadius: 7,
                          padding: "5px 10px",
                          color: s.disabled ? "#166534" : "#ef4444",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {s.disabled ? "Enable" : "Disable"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {dSlots.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "34px",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            No slots for this date
          </div>
        )}
      </div>

      {/* ── Edit Capacity Modal ── */}
      {editSlot && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setEditSlot(null)}
        >
          <div
            onClick={(e: any) => e.stopPropagation()}
            style={{
              background: "var(--card)",
              borderRadius: 18,
              padding: 26,
              maxWidth: 320,
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px",
                color: "var(--text)",
                fontSize: 16,
              }}
            >
              Edit Slot — {editSlot.time}
            </h3>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#444",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              New Capacity
            </label>
            <input
              type="number"
              value={newCap}
              onChange={(e: any) => setNewCap(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 13px",
                border: "2px solid var(--border)",
                borderRadius: 10,
                fontSize: 15,
                outline: "none",
                color: "var(--text)",
                background: "var(--bg)",
                boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: "#1F3D2B",
                  border: "none",
                  borderRadius: 9,
                  padding: "11px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditSlot(null)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "2px solid var(--border)",
                  borderRadius: 9,
                  padding: "11px",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Slot Modal ── */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowAddForm(false)}
        >
          <div
            onClick={(e: any) => e.stopPropagation()}
            style={{
              background: "var(--card)",
              borderRadius: 18,
              padding: 26,
              maxWidth: 380,
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px",
                color: "var(--text)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Add New Slot
            </h3>

            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#444",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              Date
            </label>
            <input
              type="date"
              value={newSlot.date}
              onChange={(e: any) => {
                const nextDate = e.target.value;
                const nextTakenTimes = new Set(
                  slots
                    .filter((s: any) => nd(s.date) === nd(nextDate))
                    .map((s: any) => s.time)
                );

                setNewSlot({
                  ...newSlot,
                  date: nextDate,
                  time: nextTakenTimes.has(newSlot.time) ? "" : newSlot.time,
                });
              }}
              style={{
                width: "100%",
                padding: "11px 13px",
                border: "2px solid var(--border)",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                color: "var(--text)",
                background: "var(--bg)",
                boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 14,
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#444",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              Time
            </label>
            <select
              value={newSlot.time}
              onChange={(e: any) =>
                setNewSlot({ ...newSlot, time: e.target.value })
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                border: "2px solid var(--border)",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                color: "var(--text)",
                background: "var(--bg)",
                boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 14,
              }}
            >
              <option value="">Select Time</option>
              {SLOT_TIMES.map((t) => {
                const taken = takenTimes.has(t);
                return (
                  <option key={t} value={t} disabled={taken}>
                    {taken ? `${t} - already exists` : t}
                  </option>
                );
              })}
            </select>

            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#444",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              Capacity
            </label>
            <input
              type="number"
              value={newSlot.capacity}
              onChange={(e: any) =>
                setNewSlot({ ...newSlot, capacity: e.target.value })
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                border: "2px solid var(--border)",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                color: "var(--text)",
                background: "var(--bg)",
                boxSizing: "border-box",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 20,
              }}
            />

            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={handleCreateSlot}
                style={{
                  flex: 1,
                  background: "#1F3D2B",
                  border: "none",
                  borderRadius: 9,
                  padding: "11px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Create Slot
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "2px solid var(--border)",
                  borderRadius: 9,
                  padding: "11px",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Status dropdown — lets admin switch a user to any other status
// ─────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; bd: string; tx: string }> = {
  active: { bg: "#f0fdf4", bd: "#bbf7d0", tx: "#166534" },
  pending: { bg: "#fefce8", bd: "#fde68a", tx: "#92400e" },
  disabled: { bg: "#fef2f2", bd: "#fecaca", tx: "#ef4444" },
};

const STATUS_BADGE: Record<string, { bg: string; tx: string }> = {
  active: { bg: "#dcfce7", tx: "#166534" },
  pending: { bg: "#fef3c7", tx: "#92400e" },
  disabled: { bg: "#fee2e2", tx: "#991b1b" },
};

function StatusDropdown({ user, onDone }: { user: any; onDone: () => void }) {
  const { showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const options = (['active', 'pending', 'disabled'] as string[]).filter(
    (s) => s !== user.status
  );

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedMenuHeight = options.length * 40 + 8;
      setOpenUp(window.innerHeight - rect.bottom < estimatedMenuHeight);
    }
    setOpen((prev) => !prev);
  };

  const apply = async (status: string) => {
    setLoading(true);
    setOpen(false);
    try {
      await API.patch(`/users/${user.id}`, { status });
      showToast(`${user.name} → ${status}`, 'success');
      onDone();
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={loading}
        style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 7,
          padding: '4px 10px',
          color: '#0369a1',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans',sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {loading ? '…' : 'Set Status'} <span style={{ fontSize: 9 }}>▼</span>
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: openUp ? 'auto' : '110%',
              bottom: openUp ? '110%' : 'auto',
              left: 0,
              zIndex: 200,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              minWidth: 130,
              overflow: 'hidden',
            }}
          >
            {options.map((opt, idx) => {
              const c = STATUS_COLORS[opt];
              return (
                <button
                  key={opt}
                  onClick={() => apply(opt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '9px 14px',
                    background: c.bg,
                    border: 'none',
                    borderBottom: idx < options.length - 1 ? '1px solid var(--border)' : 'none',
                    color: c.tx,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'DM Sans',sans-serif",
                    textAlign: 'left',
                    textTransform: 'capitalize',
                  }}
                >
                  → {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// User Manager — "admin-users" page
// Admin can approve pending users, disable/enable accounts.
// ─────────────────────────────────────────────
export function AdminUsers() {
  const { users, updateSlots, updateUsers, updateBookings, showToast } = useApp();

  const doRefresh = useCallback(async () => {
    await refreshAll(updateSlots, updateUsers, updateBookings);
  }, [updateSlots, updateUsers, updateBookings]);

  const quickApprove = async (u: any) => {
    try {
      await API.patch(`/users/${u.id}`, { status: "active" });
      showToast(`${u.name} approved ✅`, "success");
      await doRefresh();
    } catch {
      showToast("Update failed", "error");
    }
  };

  const quickDisable = async (u: any) => {
    try {
      await API.patch(`/users/${u.id}`, { status: "disabled" });
      showToast(`${u.name} disabled`, "warning");
      await doRefresh();
    } catch {
      showToast("Update failed", "error");
    }
  };

  const quickEnable = async (u: any) => {
    try {
      await API.patch(`/users/${u.id}`, { status: "active" });
      showToast(`${u.name} re-enabled ✅`, "success");
      await doRefresh();
    } catch {
      showToast("Update failed", "error");
    }
  };

  return (
    <div>
      <h1
        style={{
          fontSize: 23,
          fontWeight: 800,
          margin: "0 0 4px",
          color: "var(--text)",
        }}
      >
        User Manager
      </h1>
      <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: 13 }}>
        Approve, disable, and manage members
      </p>
      <div
        style={{
          background: "var(--card)",
          borderRadius: 14,
          overflow: "auto",
          boxShadow: "var(--shadow)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 520,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {[
                "Name",
                "Email",
                "Regiment",
                "Role",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 13px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u: any, i: any) => {
              const sc: any = (
                {
                  active: { bg: "#dcfce7", tx: "#166534" },
                  pending: { bg: "#fef3c7", tx: "#92400e" },
                  disabled: { bg: "#fee2e2", tx: "#991b1b" },
                } as any
              )[u.status] || {};
              return (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:
                      i < users.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 13px",
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {u.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 13px",
                      color: "var(--muted)",
                      fontSize: 11,
                    }}
                  >
                    {u.email}
                  </td>
                  <td
                    style={{
                      padding: "12px 13px",
                      color: "var(--muted)",
                      fontSize: 11,
                    }}
                  >
                    {u.regiment}
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <span
                      style={{
                        background:
                          u.role?.toLowerCase() === "admin" ? "#fef3c7" : "#f3f4f6",
                        color:
                          u.role?.toLowerCase() === "admin" ? "#92400e" : "#555",
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.tx,
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 13px" }}>
                    <div style={{ display: "flex", gap: 5, alignItems: 'center' }}>
                      {u.status === "pending" && (
                        <button
                          onClick={() => quickApprove(u)}
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 7,
                            padding: "4px 10px",
                            color: "#166534",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {u.status === "active" && u.role?.toLowerCase() !== "admin" && (
                        <button
                          onClick={() => quickDisable(u)}
                          style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: 7,
                            padding: "4px 10px",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          Disable
                        </button>
                      )}
                      {u.status === "disabled" && (
                        <button
                          onClick={() => quickEnable(u)}
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 7,
                            padding: "4px 10px",
                            color: "#166534",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          Enable
                        </button>
                      )}
                      {u.role?.toLowerCase() !== "admin" && (
                        <StatusDropdown user={u} onDone={doRefresh} />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
