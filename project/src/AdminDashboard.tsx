// AdminDashboard.tsx
// Full admin dashboard panel — Overview, Slot Manager, User Manager.
// Imported and rendered by App.tsx when the logged-in user has role === "admin".

import { useState, useEffect, useCallback, useRef } from "react";
import API from "./services/api";
import { useApp } from "./context";

// Fixed time slot periods (lunch 1-2 PM is excluded)
const SLOT_TIME_RANGES = [
  { key: "9-10", display: "9:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { key: "10-11", display: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { key: "11-12", display: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { key: "12-1", display: "12:00 PM - 1:00 PM", start: "12:00", end: "13:00" },
  // 1:00 PM - 2:00 PM is lunch break (closed)
  { key: "2-3", display: "2:00 PM - 3:00 PM", start: "14:00", end: "15:00" },
  { key: "3-4", display: "3:00 PM - 4:00 PM", start: "15:00", end: "16:00" },
  { key: "4-5", display: "4:00 PM - 5:00 PM", start: "16:00", end: "17:00" },
];
const CLOSING_SLOT_TIME = "4:00 PM - 5:00 PM";

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

function userAllowedCategoryLabel(value: any) {
  if (value === "GROCERY_ONLY") return "Grocery Only";
  if (value === "LIQUOR_ONLY") return "Liquor Only";
  if (value === "BOTH") return "Both";
  return String(value || "");
}

function useIsMobileScreen(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
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
    updateSlots(sRes.data?.data || sRes.data || []);
    updateBookings(bRes.data?.data || bRes.data || []);
    updateUsers(uRes.data?.data || uRes.data || []);
  } catch (e) {
    console.error("refreshAll failed", e);
  }
}

// ─────────────────────────────────────────────
// Overview — shown on the "admin-dashboard" page
// ─────────────────────────────────────────────
export default function AdminDashboard({ lang, onNav }: any) {
  const { bookings: rawBookings, slots, users: rawUsers, notices, updateNotices, showToast } = useApp();
  // Get translation object — if lang is not passed (backward compatibility), default to English
  const langCode = lang || "en";
  const T_LOCAL = {
    en: { adminOverview:"Admin Overview", realTimeMetrics:"Real-time system metrics for 4213 URC NCC", noticeBoard:"Notice Board", postUpdates:"Post updates that all users can see on their dashboard", notice:"notice", notices:"notices", postAnnouncement:"Post an announcement for users", postNotice:"Post Notice", noNoticesYet:"No notices posted yet", todaysBookings:"Today's Bookings", totalUsers:"Total Users", pendingApproval:"Pending Approval", activeTokens:"Active Tokens", todaysSlotFillRate:"Today's Slot Fill Rate", bookingsByCategory:"Bookings by Category", groceryOnly:"Grocery", liquorOnly:"Liquor Only", groceryAndLiquor:"Grocery + Liquor", usersWithActiveBookings:"Users who currently have active bookings", filled:"filled", remove:"Remove" },
    hi: { adminOverview:"एडमिन अवलोकन", realTimeMetrics:"4213 यूआरसी एनसीसी के लिए रीयल-टाइम मेट्रिक्स", noticeBoard:"सूचना बोर्ड", postUpdates:"अपडेट पोस्ट करें जो सभी उपयोगकर्ता अपने डैशबोर्ड पर देख सकें", notice:"सूचना", notices:"सूचनाएं", postAnnouncement:"उपयोगकर्ताओं के लिए घोषणा पोस्ट करें", postNotice:"सूचना पोस्ट करें", noNoticesYet:"अभी कोई सूचना पोस्ट नहीं की गई", todaysBookings:"आज की बुकिंग", totalUsers:"कुल उपयोगकर्ता", pendingApproval:"स्वीकृति के लिए लंबित", activeTokens:"सक्रिय टोकन", todaysSlotFillRate:"आज की स्लॉट भरण दर", bookingsByCategory:"श्रेणी के अनुसार बुकिंग", groceryOnly:"किराना", liquorOnly:"केवल शराब", groceryAndLiquor:"किराना + शराब", usersWithActiveBookings:"वे उपयोगकर्ता जिनके पास सक्रिय बुकिंग है", filled:"भरा", remove:"हटाएँ" },
    te: { adminOverview:"అడ్మిన్ అవలోకనం", realTimeMetrics:"4213 యూఆర్‌సీ ఎన్‌సీసీ కోసం రియల్-టైమ్ మెట్రిక్‌లు", noticeBoard:"నోటిసు బోర్డ్", postUpdates:"మీ డ్యాష్‌బోర్డ్‌లో సభి వినియోగదారులు చూడగలిగే అప్‌డేట్‌లు పోస్ట్ చేయండి", notice:"నోటిసు", notices:"నోటిసులు", postAnnouncement:"వినియోగదారుల కోసం ఘోషణ పోస్ట్ చేయండి", postNotice:"నోటిసు పోస్ట్ చేయండి", noNoticesYet:"ఇంకా నోటిసులు పోస్ట్ చేయలేదు", todaysBookings:"ఈ రోజు బుకింగ్‌లు", totalUsers:"మొత్తం వినియోగదారులు", pendingApproval:"ఆమోదనకు పెండింగ్", activeTokens:"సక్రియ టోకెన్‌లు", todaysSlotFillRate:"ఈ రోజు స్లాట్ నింపే రేటు", bookingsByCategory:"వర్గం ద్వారా బుకింగ్‌లు", groceryOnly:"కిరాణా", liquorOnly:"మద్యం మాత్రమే", groceryAndLiquor:"కిరాణా + మద్యం", usersWithActiveBookings:"సక్రియ బుకింగ్‌లు ఉన్న వినియోగదారులు", filled:"నిండింది", remove:"తొలగించండి" },
    ta: { adminOverview:"நிர్வாக மேலோட்டம்", realTimeMetrics:"4213 யூஆர்சி என்சிசிக்கான நிஜ-நேர மெட்ரிக்குகள்", noticeBoard:"அறிப்பு பலகை", postUpdates:"உங்கள் டாஷ்போர்டுவில் அனைத்து பயனர்களும் பார்க்கக்கூடிய புதுப்பிப்புகளை பதிவிடவும்", notice:"அறிப்பு", notices:"அறிப்புகள்", postAnnouncement:"பயனர்களுக்கான அறிவிப்பு பதிவிடவும்", postNotice:"அறிப்பு பதிவிடவும்", noNoticesYet:"இன்னும் எந்த அறிப்பும் பதிவிடப்படவில்லை", todaysBookings:"இன்றைய பதிவுகள்", totalUsers:"மொத்த பயனர்கள்", pendingApproval:"ஒப்புதலுக்கு காத்திருக்கிறது", activeTokens:"செயலில் உள்ள டோக்கன்கள்", todaysSlotFillRate:"இன்றைய ஸ்லாட் நிரப்பு விகிதம்", bookingsByCategory:"வகையின் அடிப்படையில் பதிவுகள்", groceryOnly:"மளிகை", liquorOnly:"மதுபானம் மட்டுமே", groceryAndLiquor:"மளிகை + மதுபானம்", usersWithActiveBookings:"செயலில் உள்ள பதிவுகள் உள்ள பயனர்கள்", filled:"நிரம்பியது", remove:"அகற்று" }
  } as any;
  const t = T_LOCAL[langCode] || T_LOCAL["en"];
  const today = new Date().toISOString().split("T")[0];
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

// Today's active tokens only
const activeBookings = bookings.filter(
  (b: any) =>
    b.date === today &&
    b.status === "active"
);

// Today's completed tokens
const completedBookings = bookings.filter(
  (b: any) =>
    b.date === today &&
    b.status === "completed"
);

// Today's cancelled tokens
const cancelledBookings = bookings.filter(
  (b: any) =>
    b.date === today &&
    b.status === "cancelled"
);
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
        {t.adminOverview}
      </h1>
      <p
        style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: 13 }}
      >
        {t.realTimeMetrics}
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
              {t.noticeBoard}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {t.postUpdates}
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2B" }}>
            {notices.length} {notices.length !== 1 ? t.notices : t.notice}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <input
            value={newNotice}
            onChange={(e: any) => setNewNotice(e.target.value)}
            placeholder={t.postAnnouncement}
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
            {t.postNotice}
          </button>
        </div>

        {notices.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {t.noNoticesYet}.
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
                  {t.remove}
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
          { l: t.todaysBookings, v: tb.length, i: "📅", c: "#1F3D2B" },
          { l: t.totalUsers, v: users.length, i: "👥", c: "#1e40af" },
          {
            l: t.pendingApproval,
            v: users.filter((u: any) => u.status === "pending").length,
            i: "⏳",
            c: "#92400e",
          },
         {
    l: t.activeTokens,
    v: activeBookings.length,
    i: "✅",
    c: "#065f46",
},
{
    l: "Completed Today",
    v: completedBookings.length,
    i: "✔️",
    c: "#2563eb",
},
{
    l: "Cancelled Today",
    v: cancelledBookings.length,
    i: "❌",
    c: "#dc2626",
},
        ].map((s: any) => (
          <div
            key={s.l}
            onClick={s.l === t.activeTokens ? () => onNav?.("admin-tokens") : undefined}
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: "19px 17px",
              boxShadow: "var(--shadow)",
              cursor: s.l === t.activeTokens ? "pointer" : "default",
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
            {t.todaysSlotFillRate}
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
          {fp}% {t.filled}
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
          {t.bookingsByCategory}
        </h3>
        {[t.groceryOnly, t.liquorOnly, t.groceryAndLiquor].map(
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
  const tomorrowStr = new Date(new Date().getTime() + 86400000).toISOString().split("T")[0];
  const [selDate, setSelDate] = useState(tomorrowStr);
  const [editSlot, setEditSlot] = useState<any>(null);
  const [newCap, setNewCap] = useState("");
  const [showAddDateForm, setShowAddDateForm] = useState(false);
  const [newDate, setNewDate] = useState(tomorrowStr);

  const doRefresh = useCallback(async () => {
    await refreshAll(updateSlots, updateUsers, updateBookings);
  }, [updateSlots, updateUsers, updateBookings]);

  const normalizedSelDate = nd(selDate);

  // Get all unique dates from existing slots
  const existingDates = [...new Set(slots.map((s: any) => nd(s.date)).filter(Boolean))] as string[];
  const activeDates = existingDates.filter((date) => date > todayStr);
  const allDates = [...new Set([...activeDates, normalizedSelDate].filter((date) => date > todayStr))].sort().slice(0, 30);
  
  // Get slots for selected date
  const dSlots = slots.filter((s: any) => nd(s.date) === normalizedSelDate).sort((a: any, b: any) => {
    const timeOrder = SLOT_TIME_RANGES.map((r) => r.display);
    const aIndex = timeOrder.indexOf(a.time);
    const bIndex = timeOrder.indexOf(b.time);
    return (aIndex >= 0 ? aIndex : 999) - (bIndex >= 0 ? bIndex : 999);
  });

  // Helper: Create/ensure all time slots for a date
  const ensureAllTimeSlotsForDate = async (dateStr: string) => {
    try {
      for (const timeRange of SLOT_TIME_RANGES) {
        const exists = slots.some(
          (s: any) => nd(s.date) === dateStr && s.time === timeRange.display
        );
        
        if (!exists) {
          // Create slot for this time on this date
          await API.post("/slots", {
            date: dateStr,
            time: timeRange.display,
            capacity: 50, // Default capacity
            disabled: timeRange.display === CLOSING_SLOT_TIME,
          });
        }
      }
      await doRefresh();
      showToast(`All time slots created for ${dateStr}`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create slots", "error");
    }
  };

  // Handle adding a new date
  const handleAddDate = async () => {
    if (!newDate) {
      showToast("Please select a date", "error");
      return;
    }
    const normalizedNewDate = nd(newDate);
    if (normalizedNewDate <= todayStr) {
      showToast("Can only add slots for future dates", "error");
      return;
    }
    
    setShowAddDateForm(false);
    setSelDate(normalizedNewDate);
    await ensureAllTimeSlotsForDate(normalizedNewDate);
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
            Set availability for fixed time slots: 9 AM - 5 PM (lunch 1-2 PM closed)
          </p>
        </div>
        <button
          onClick={() => setShowAddDateForm(true)}
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
          + Add Date
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

      {/* ── Info Box ── */}
      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#166534", fontSize: 12 }}>
        ℹ️ <strong>Fixed Times:</strong> 9-10 AM, 10-11 AM, 11-12 PM, 12-1 PM, 2-3 PM, 3-4 PM, 4-5 PM · <strong>Lunch Break:</strong> 1-2 PM (closed)
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
            minWidth: 600,
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
                "Time Slot",
                "Capacity",
                "Booked",
                "Available",
                "Fill %",
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
            {dSlots.length > 0 ? (
              dSlots.map((s: any, i: any) => {
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
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "34px", color: "var(--muted)", fontSize: 13 }}>
                  No slots for this date. Click "Add Date" to create all time slots.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              Edit Capacity — {editSlot.time}
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
              Number of Slots
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

      {/* ── Add Date Modal ── */}
      {showAddDateForm && (
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
          onClick={() => setShowAddDateForm(false)}
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
              Add Booking Date
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 14 }}>
              All 7 time slots will be automatically created for this date with 50 slots per time.
            </p>
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
              Select Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e: any) => setNewDate(e.target.value)}
              min={tomorrowStr}
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
                onClick={handleAddDate}
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
                Add Date
              </button>
              <button
                onClick={() => setShowAddDateForm(false)}
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
// Admin Tokens — dedicated page for active/completed grocery tokens
// ─────────────────────────────────────────────
export function AdminTokens() {
  const { bookings: rawBookings, updateSlots, updateUsers, updateBookings, showToast } = useApp();
  const [filter, setFilter] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const isCompact = useIsMobileScreen(980);

  const doRefresh = useCallback(async () => {
    await refreshAll(updateSlots, updateUsers, updateBookings);
  }, [updateSlots, updateUsers, updateBookings]);

  useEffect(() => {
    doRefresh();
  }, [doRefresh]);

  const bookings = rawBookings.map((b: any) => ({
    ...b,
    date: nd(b.date || b.slot?.date),
    time: b.time || b.slot?.time || "",
    status: ns(b.status),
    category: bookingCategoryLabel(b.category),
  }));

  const activeBookings = bookings.filter((b: any) => b.status === "active");
  const completedBookings = bookings.filter((b: any) => b.status === "completed");
  
  // Filter by search query (name, email, card ID)
  const filterBySearch = (bookingList: any[]) => {
    if (!searchQuery.trim()) return bookingList;
    const query = searchQuery.toLowerCase();
    return bookingList.filter((b: any) => {
      const name = (b.user?.name || "").toLowerCase();
      const email = (b.user?.email || "").toLowerCase();
      const cardId = (b.user?.cardId || "").toLowerCase();
      const token = (b.tokenNo || "").toLowerCase();
      return name.includes(query) || email.includes(query) || cardId.includes(query) || token.includes(query);
    });
  };

  const filteredActive = filterBySearch(activeBookings);
  const filteredCompleted = filterBySearch(completedBookings);
  const visibleBookings = filter === "active" ? filteredActive : filteredCompleted;

  // PDF Download function
  const downloadPDF = (tokenList: any[], fileName: string) => {
    if (tokenList.length === 0) {
      showToast("No tokens to download", "warning");
      return;
    }

    // Create CSV content
    let csv = "Name,Email,Card ID,Date,Time,Category,Token,Status\n";
    tokenList.forEach((b: any) => {
      const name = `"${b.user?.name || ""}"`;
      const email = `"${b.user?.email || ""}"`;
      const cardId = b.user?.cardId || "";
      const date = b.date || "";
      const time = b.time || "";
      const category = b.category || "";
      const token = b.tokenNo || "";
      const status = b.status || "";
      csv += `${name},${email},${cardId},${date},${time},${category},${token},${status}\n`;
    });

    // Create and download file
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `${fileName}_${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${tokenList.length} ${fileName.toLowerCase()}`, "success");
  };

  const markCompleted = async (bookingId: string) => {
    try {
      await API.patch(`/bookings/${bookingId}/complete`);
      showToast("Token moved to completed", "success");
      await doRefresh();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to complete token", "error");
    }
  };

  return (
    <div style={{ width: "100%", minWidth: 0, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: isCompact ? "wrap" : "nowrap", position: "relative", zIndex: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 23, fontWeight: 800, margin: "0 0 4px", color: "var(--text)" }}>Token Manager</h1>
          <p style={{ color: "var(--muted)", margin: "0", fontSize: 13 }}>
            Active tokens stay visible until completed by admin or until 5:00 PM on the booked date.
          </p>
        </div>
        <button
          onClick={() => downloadPDF(filter === "active" ? filteredActive : filteredCompleted, filter === "active" ? "ActiveTokens" : "CompletedTokens")}
          style={{
            background: "#1F3D2B",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
            fontSize: 12,
            whiteSpace: "nowrap",
            flexShrink: 0,
            position: "relative",
            visibility: "visible",
            display: "block",
          }}
        >
          📥 Download {filter === "active" ? "Active" : "Completed"} Tokens
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 18, width: "100%", position: "relative", zIndex: 10, visibility: "visible", display: "block" }}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, card ID, or token number..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid var(--border)",
            borderRadius: 12,
            fontSize: 14,
            outline: "none",
            color: "var(--text)",
            background: "var(--bg)",
            fontFamily: "'DM Sans',sans-serif",
            boxSizing: "border-box",
            position: "relative",
            visibility: "visible",
            display: "block",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { id: "active", label: `Active Tokens (${filteredActive.length})` },
          { id: "completed", label: `Completed Tokens (${filteredCompleted.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: "9px 14px",
              borderRadius: 20,
              border: "2px solid",
              borderColor: filter === tab.id ? "#1F3D2B" : "var(--border)",
              background: filter === tab.id ? "#1F3D2B" : "var(--card)",
              color: filter === tab.id ? "#fff" : "var(--muted)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              width: isCompact ? "100%" : "auto",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleBookings.length === 0 ? (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "34px 20px", textAlign: "center", boxShadow: "var(--shadow)", color: "var(--muted)", fontSize: 13 }}>
          No {filter} tokens found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visibleBookings.map((b: any) => (
            <div
              key={b.id}
              style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: "18px 18px",
                boxShadow: "var(--shadow)",
                display: "grid",
                gridTemplateColumns: isCompact
                  ? "1fr"
                  : "minmax(180px,1.3fr) minmax(110px,0.8fr) minmax(120px,0.9fr) minmax(120px,0.9fr) minmax(130px,1fr) minmax(120px,0.8fr) minmax(130px,0.9fr)",
                gap: isCompact ? 14 : 12,
                alignItems: isCompact ? "stretch" : "center",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                  {b.user?.name || b.userId}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>{b.user?.email || "No email"}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Card ID: {b.user?.cardId || "-"}</div>
              </div>
              {isCompact ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Date</div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{b.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Time</div>
                    <div style={{ fontSize: 12, color: "var(--text)" }}>{b.time || "-"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Category</div>
                    <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{b.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Token</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: filter === "active" ? "#065f46" : "#1e40af", wordBreak: "break-word" }}>{b.tokenNo}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: "var(--text)" }}>{b.date}</div>
                  <div style={{ fontSize: 12, color: "var(--text)" }}>{b.time || "-"}</div>
                  <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{b.category}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: filter === "active" ? "#065f46" : "#1e40af" }}>{b.tokenNo}</div>
                </>
              )}
              <div>
                <span
                  style={{
                    background: filter === "active" ? "#dcfce7" : "#dbeafe",
                    color: filter === "active" ? "#166534" : "#1e40af",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 20,
                    textTransform: "uppercase",
                  }}
                >
                  {b.status}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: isCompact ? "stretch" : "flex-end" }}>
                {filter === "active" ? (
                  <button
                    onClick={() => markCompleted(b.id)}
                    style={{
                      background: "#1F3D2B",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 14px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'DM Sans',sans-serif",
                      width: isCompact ? "100%" : "auto",
                    }}
                  >
                    Mark Completed
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Completed</span>
                )}
              </div>
            </div>
          ))}
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
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const options = (['active', 'pending', 'disabled'] as string[]).filter(
    (s) => s !== user.status
  );

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedMenuHeight = options.length * 40 + 8;
      setOpenUp(window.innerHeight - rect.bottom < estimatedMenuHeight);
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
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
              position: 'fixed',
              top: openUp ? 'auto' : menuPos.top,
              bottom: openUp && buttonRef.current ? window.innerHeight - buttonRef.current.getBoundingClientRect().top + 6 : 'auto',
              left: menuPos.left,
              zIndex: 300,
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

function AccessDropdown({ user, onDone }: { user: any; onDone: () => void }) {
  const { showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const options = ["GROCERY_ONLY", "LIQUOR_ONLY", "BOTH"].filter(
    (value) => value !== user.allowedCategory
  );

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const estimatedMenuHeight = options.length * 40 + 8;
      setOpenUp(window.innerHeight - rect.bottom < estimatedMenuHeight);
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
    }
    setOpen((prev) => !prev);
  };

  const apply = async (allowedCategory: string) => {
    setLoading(true);
    setOpen(false);
    try {
      await API.patch(`/users/${user.id}`, { allowedCategory });
      showToast(`${user.name} → ${userAllowedCategoryLabel(allowedCategory)}`, "success");
      onDone();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={loading}
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 7,
          padding: "4px 10px",
          color: "#166534",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {loading ? "..." : "Set Access"} <span style={{ fontSize: 9 }}>▼</span>
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 199 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: openUp ? "auto" : menuPos.top,
              bottom: openUp && buttonRef.current ? window.innerHeight - buttonRef.current.getBoundingClientRect().top + 6 : "auto",
              left: menuPos.left,
              zIndex: 300,
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              minWidth: 150,
              overflow: "hidden",
            }}
          >
            {options.map((opt, idx) => (
              <button
                key={opt}
                onClick={() => apply(opt)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "9px 14px",
                  background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                  border: "none",
                  borderBottom: idx < options.length - 1 ? "1px solid var(--border)" : "none",
                  color: "#1f2937",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                  textAlign: "left",
                }}
              >
                {userAllowedCategoryLabel(opt)}
              </button>
            ))}
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
  const { users: rawUsers, updateSlots, updateUsers, updateBookings, showToast } = useApp();
  const isCompact = useIsMobileScreen(920);
  const [searchQuery, setSearchQuery] = useState("");
const [userFilter, setUserFilter] = useState<
  "all" | "pending" | "approved" | "disabled"
>("all");

  const doRefresh = useCallback(async () => {
    await refreshAll(updateSlots, updateUsers, updateBookings);
  }, [updateSlots, updateUsers, updateBookings]);

  const users = rawUsers.map((u: any) => ({
    ...u,
    status: ns(u.status),
  }));
  const pendingCount = users.filter(
  (u: any) => u.status === "pending"
).length;

const approvedCount = users.filter(
  (u: any) => u.status === "active"
).length;
const disabledCount = users.filter(
  (u: any) => u.status === "disabled"
).length;

  // Filter by search query (name, email, card ID, regiment)
  const filterBySearch = (userList: any[]) => {
    if (!searchQuery.trim()) return userList;
    const query = searchQuery.toLowerCase();
    return userList.filter((u: any) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const cardId = (u.cardId || "").toLowerCase();
      const regiment = (u.regiment || "").toLowerCase();
      return name.includes(query) || email.includes(query) || cardId.includes(query) || regiment.includes(query);
    });
  };

const filteredUsers = filterBySearch(
  users.filter((u: any) => {
    if (userFilter === "pending")
      return u.status === "pending";

    if (userFilter === "approved")
      return u.status === "active";

    if (userFilter === "disabled")
      return u.status === "disabled";

    return true;
  })
);
  // CSV Download function
  const downloadUserListCSV = () => {
    if (filteredUsers.length === 0) {
      showToast("No users to download", "warning");
      return;
    }

    let csv = "Name,Email,Regiment,Card ID,Role,Status,Booking Access\n";
    filteredUsers.forEach((u: any) => {
      const name = `"${u.name || ""}"`;
      const email = `"${u.email || ""}"`;
      const regiment = `"${u.regiment || ""}"`;
      const cardId = u.cardId || "";
      const role = u.role || "";
      const status = u.status || "";
      const access = userAllowedCategoryLabel(u.allowedCategory);
      csv += `${name},${email},${regiment},${cardId},${role},${status},${access}\n`;
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `UserList_${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${filteredUsers.length} users`, "success");
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 20, flexWrap: isCompact ? "wrap" : "nowrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
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
          <p style={{ color: "var(--muted)", margin: "0", fontSize: 13 }}>
            Approve, disable, and manage members
          </p>
        </div>
        <button
    onClick={() => setUserFilter("pending")}
    style={{
        background: userFilter === "pending" ? "#f59e0b" : "#fff7ed",
        color: "#92400e",
        border: "1px solid #fbbf24",
        borderRadius: 10,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 700,
    }}
>
    ⏳ Pending ({pendingCount})
</button>

<button
    onClick={() => setUserFilter("approved")}
    style={{
        background: userFilter === "approved" ? "#16a34a" : "#f0fdf4",
        color: "#166534",
        border: "1px solid #86efac",
        borderRadius: 10,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 700,
    }}
>
    ✅ Approved ({approvedCount})
</button>

<button
    onClick={() => setUserFilter("all")}
    style={{
        background: "#f8fafc",
        border: "1px solid #d1d5db",
        borderRadius: 10,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 700,
    }}
>
    All Users
</button>
<button
  onClick={() => setUserFilter("disabled")}
  style={{
    background:
      userFilter === "disabled"
        ? "#ef4444"
        : "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "'DM Sans',sans-serif",
  }}
>
  🚫 Disabled ({disabledCount})
</button>

<button
    onClick={downloadUserListCSV}
    style={{
        background: "#1F3D2B",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: 700,
    }}
>
    📥 Download Users
</button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 18, width: "100%" }}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, card ID, or regiment..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid var(--border)",
            borderRadius: 12,
            fontSize: 14,
            outline: "none",
            color: "var(--text)",
            background: "var(--bg)",
            fontFamily: "'DM Sans',sans-serif",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div
        style={{
          background: "var(--card)",
          borderRadius: 14,
          overflow: "visible",
          boxShadow: "var(--shadow)",
        }}
      >
        {isCompact ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12 }}>
            {filteredUsers.map((u: any) => {
              const sc: any = (
                {
                  active: { bg: "#dcfce7", tx: "#166534" },
                  pending: { bg: "#fef3c7", tx: "#92400e" },
                  disabled: { bg: "#fee2e2", tx: "#991b1b" },
                } as any
              )[u.status] || {};

              return (
                <div
                  key={u.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{u.email}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Regiment</div>
                      <div style={{ fontSize: 12, color: "var(--text)" }}>{u.regiment || "-"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Card ID</div>
                      <div style={{ fontSize: 12, color: "var(--text)" }}>{u.cardId || "-"}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        background: u.role?.toLowerCase() === "admin" ? "#fef3c7" : "#f3f4f6",
                        color: u.role?.toLowerCase() === "admin" ? "#92400e" : "#555",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 9px",
                        borderRadius: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {u.role}
                    </span>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.tx,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 9px",
                        borderRadius: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {u.status}
                    </span>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 9px",
                        borderRadius: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      {userAllowedCategoryLabel(u.allowedCategory)}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    {u.status === "pending" && (
                      <button
                        onClick={() => quickApprove(u)}
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 10,
                          padding: "10px 12px",
                          color: "#166534",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
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
                          borderRadius: 10,
                          padding: "10px 12px",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
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
                          borderRadius: 10,
                          padding: "10px 12px",
                          color: "#166534",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Enable
                      </button>
                    )}
                    {u.role?.toLowerCase() !== "admin" && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <StatusDropdown user={u} onDone={doRefresh} />
                        <AccessDropdown user={u} onDone={doRefresh} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ overflowX: "auto", overflowY: "visible" }}>
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
                    "Card ID",
                    "Role",
                    "Status",
                    "Booking Access",
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
                {filteredUsers.map((u: any, i: any) => {
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
                          i < filteredUsers.length - 1
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
                      <td
                        style={{
                          padding: "12px 13px",
                          color: "var(--muted)",
                          fontSize: 11,
                        }}
                      >
                        {u.cardId || "-"}
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
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 18,
                            textTransform: "uppercase",
                          }}
                        >
                          {userAllowedCategoryLabel(u.allowedCategory)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 13px" }}>
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
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
                            <>
                              <StatusDropdown user={u} onDone={doRefresh} />
                              <AccessDropdown user={u} onDone={doRefresh} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
