import { useApp } from "./context";

export default function UserDashboard({ onNav, t }: any) {
  const { currentUser, bookings, slots, notices } = useApp();

  const my = bookings.filter((b: any) => b.userId === currentUser.id);
  const up = my.filter((b: any) => b.status === "active")[0];

  const today = new Date().toISOString().split("T")[0];
  const avail = slots.filter(
    (s: any) => s.date === today && !s.disabled && s.booked < s.capacity
  ).length;

  return (
    <div>
      <h1
        style={{
          fontSize: 25,
          fontWeight: 800,
          margin: "0 0 4px",
          color: "var(--text)",
        }}
      >
        {t.welcomeMsg}, {currentUser.name.split(" ")[0]}
      </h1>
      <p
        style={{
          color: "var(--muted)",
          margin: "0 0 26px",
          fontSize: 14,
        }}
      >
        {t.unit}
      </p>

      <div
        style={{
          background: "var(--card)",
          borderRadius: 18,
          padding: 20,
          marginBottom: 22,
          boxShadow: "var(--shadow)",
          borderLeft: "4px solid #c9a84c",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: 10,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {t.noticeBoard}
        </div>
        {notices.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {t.noNoticesYet}.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notices.slice(0, 5).map((notice: any) => (
              <div
                key={notice.id}
                style={{
                  padding: "10px 12px",
                  background: "rgba(201,168,76,0.08)",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text)",
                    lineHeight: 1.5,
                  }}
                >
                  {notice.message}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginTop: 5,
                  }}
                >
                  {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleString("en-IN")
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 13,
          marginBottom: 24,
        }}
      >
        {[
          { l: t.totalBookings, v: my.length, i: t.bookingLabel, c: "#1F3D2B" },
          {
            l: t.activeTokens,
            v: my.filter((b: any) => b.status === "active").length,
            i: t.tokensLabel,
            c: "#065f46",
          },
          { l: t.availableToday, v: avail, i: t.timingLabel, c: "#92400e" },
        ].map((s: any) => (
          <div
            key={s.l}
            style={{
              background: "var(--card)",
              borderRadius: 15,
              padding: "19px 17px",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 7 }}>{s.i}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>
              {s.v}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {up ? (
        <div
          style={{
            background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)",
            borderRadius: 18,
            padding: 24,
            marginBottom: 20,
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#c9a84c",
              marginBottom: 7,
              textTransform: "uppercase",
            }}
          >
            {t.upcomingBooking}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>
            {up.category}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
              marginBottom: 3,
            }}
          >
            {t.date}: {up.date} | {t.time}: {up.time}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.48)",
              marginBottom: 13,
            }}
          >
            {t.token}: {up.tokenNo}
          </div>
          <button
            onClick={() => onNav("bookings")}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9,
              padding: "8px 16px",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {t.viewToken}
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 18,
            padding: 24,
            marginBottom: 20,
            textAlign: "center",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 9 }}>[--]</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            {t.noUpcomingBookings}
          </div>
          <div
            style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}
          >
            {t.bookSlotToVisit}
          </div>
          <button
            onClick={() => onNav("book")}
            style={{
              background: "#1F3D2B",
              color: "#fff",
              border: "none",
              borderRadius: 11,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {t.bookSlot}
          </button>
        </div>
      )}
    </div>
  );
}
