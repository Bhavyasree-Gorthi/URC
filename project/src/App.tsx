// App.tsx
// Root application shell.
// Dashboard views are split into two separate files:
//   • UserDashboard.tsx  — user overview
//   • AdminDashboard.tsx — AdminDashboard (overview), AdminSlots, AdminUsers
//
// ADMIN LOGIN FIX:
//   The login handler now normalises the role to lowercase before comparing,
//   so "ADMIN" (from the DB) and "admin" both match. The initial page is set
//   to "admin-dashboard" for admin users so the admin shell renders correctly.

import { useState, useEffect, useCallback } from "react";
import API from "./services/api";
import { Ctx, useApp } from "./context";

// ── Separate dashboard files ──────────────────────────────────────────────────
import UserDashboard from "./UserDashboard";
import AdminDashboard, { AdminSlots, AdminUsers } from "./AdminDashboard";
// ─────────────────────────────────────────────────────────────────────────────

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: { welcome:"WELCOME TO",unit:"4213 URC NCC GROUP, KURNOOL",tagline:"Book Your E-Slots Here",motto:"Unity and Discipline",nonMemberNote:"Non-Members are only allowed to book Grocery.",servingNote:"All Serving Personnel are requested to contact OIC/Canteen manager for drawl of liquor with Leave Certificate.",grocery:"GROCERY",liquor:"LIQUOR",both:"BOTH",myBookings:"MY BOOKINGS / CANCEL",downloadApp:"DOWNLOAD APP",myProfile:"MY PROFILE",liquorNote:"Note: Only URC NCC Group registered customers can book Liquor",aboutUs:"ABOUT US",aboutText:"Chairman, and all Staff members of URC GP HQ are constantly striving hard to provide utmost satisfaction to Veterans, War Widows, and Serving Pers by ensuring all variety of brands are made available be it Grocery or Liquor items. Our singular aim is to provide utmost satisfaction to our esteemed customers.",signIn:"Sign In",register:"Register",forgotPwd:"Forgot Password",email:"Email Address",password:"Password",name:"Your Name",choosePwd:"Choose a Password",rememberMe:"Remember Me",login:"Log In",bookSlot:"Book Slot",dashboard:"Dashboard",cancel:"Cancel",viewToken:"View Token",confirmBooking:"Confirm Booking",selectCategory:"Category",selectDate:"Select Date",selectTime:"Select Time",spotsLeft:"spots left",full:"Full",holiday:"Holiday",active:"Active",completed:"Completed",cancelled:"Cancelled",bookingSuccess:"Booking confirmed! 🎉",cancelSuccess:"Booking cancelled",onePerDay:"You already have a booking on this date!",adminLogin:"Admin Login",userLogin:"User Login",allBookings:"All Bookings",slotManager:"Slot Manager",userManager:"User Manager",overview:"Overview" },
  hi: { welcome:"स्वागत है",unit:"4213 यूआरसी एनसीसी ग्रुप, कुर्नूल",tagline:"यहाँ अपना ई-स्लॉट बुक करें",motto:"एकता और अनुशासन",nonMemberNote:"गैर-सदस्य केवल ग्रोसरी बुक कर सकते हैं।",servingNote:"सेवारत कर्मियों से अनुरोध है कि लिकर निकासी के लिए OIC/कैंटीन प्रबंधक से संपर्क करें।",grocery:"किराना",liquor:"शराब",both:"दोनों",myBookings:"मेरी बुकिंग / रद्द",downloadApp:"ऐप डाउनलोड",myProfile:"मेरी प्रोफ़ाइल",liquorNote:"नोट: केवल यूआरसी एनसीसी के पंजीकृत ग्राहक शराब बुक कर सकते हैं",aboutUs:"हमारे बारे में",aboutText:"अध्यक्ष और यूआरसी जीपी मुख्यालय के सभी कर्मचारी वीरों, युद्ध विधवाओं और सेवारत कर्मियों को किराना और शराब दोनों प्रकार की सभी ब्रांड उपलब्ध कराकर अधिकतम संतुष्टि प्रदान करने का प्रयास करते हैं।",signIn:"साइन इन",register:"पंजीकरण",forgotPwd:"पासवर्ड भूल गए",email:"ईमेल पता",password:"पासवर्ड",name:"आपका नाम",choosePwd:"पासवर्ड चुनें",rememberMe:"मुझे याद रखें",login:"लॉग इन",bookSlot:"स्लॉट बुक करें",dashboard:"डैशबोर्ड",cancel:"रद्द करें",viewToken:"टोकन देखें",confirmBooking:"बुकिंग की पुष्टि",selectCategory:"श्रेणी",selectDate:"तारीख चुनें",selectTime:"समय चुनें",spotsLeft:"स्थान शेष",full:"भरा",holiday:"छुट्टी",active:"सक्रिय",completed:"पूर्ण",cancelled:"रद्द",bookingSuccess:"बुकिंग सफल! 🎉",cancelSuccess:"बुकिंग रद्द हुई",onePerDay:"इस तारीख पर पहले से बुकिंग है!",adminLogin:"एडमिन लॉगिन",userLogin:"यूजर लॉगिन",allBookings:"सभी बुकिंग",slotManager:"स्लॉट प्रबंधक",userManager:"यूजर प्रबंधक",overview:"अवलोकन" },
  te: { welcome:"స్వాగతం",unit:"4213 యూఆర్‌సీ ఎన్‌సీసీ గ్రూప్, కర్నూల్",tagline:"ఇక్కడ మీ ఇ-స్లాట్ బుక్ చేయండి",motto:"ఐక్యత మరియు క్రమశిక్షణ",nonMemberNote:"సభ్యులు కాని వారు కేవలం కిరాణా బుక్ చేయవచ్చు.",servingNote:"సేవలో ఉన్న సిబ్బంది మద్యం కోసం OIC/కాంటీన్ మేనేజర్‌ని సంప్రదించాలి.",grocery:"కిరాణా",liquor:"మద్యం",both:"రెండూ",myBookings:"నా బుకింగ్‌లు / రద్దు",downloadApp:"యాప్ డౌన్‌లోడ్",myProfile:"నా ప్రొఫైల్",liquorNote:"గమనిక: ఎన్‌సీసీ నమోదిత సభ్యులు మాత్రమే మద్యం బుక్ చేయవచ్చు",aboutUs:"మా గురించి",aboutText:"చైర్మన్ మరియు యూఆర్‌సీ జీపీ హెడ్‌క్వార్టర్స్ సిబ్బంది వెటరన్లు, యుద్ధ వితంతువులు మరియు సేవలో ఉన్న సిబ్బందికి అన్ని బ్రాండ్లు అందుబాటులో ఉంచి గరిష్ట సంతృప్తి కలిగించడానికి నిరంతరం కృషి చేస్తున్నారు.",signIn:"సైన్ ఇన్",register:"నమోదు",forgotPwd:"పాస్‌వర్డ్ మర్చిపోయారా",email:"ఇమెయిల్",password:"పాస్‌వర్డ్",name:"మీ పేరు",choosePwd:"పాస్‌వర్డ్ ఎంచుకోండి",rememberMe:"నన్ను గుర్తుంచుకో",login:"లాగిన్",bookSlot:"స్లాట్ బుక్",dashboard:"డ్యాష్‌బోర్డ్",cancel:"రద్దు",viewToken:"టోకెన్ చూడు",confirmBooking:"బుకింగ్ నిర్ధారించు",selectCategory:"వర్గం",selectDate:"తేదీ ఎంచుకోండి",selectTime:"సమయం ఎంచుకోండి",spotsLeft:"స్థానాలు",full:"నిండింది",holiday:"సెలవు",active:"సక్రియం",completed:"పూర్తి",cancelled:"రద్దు",bookingSuccess:"బుకింగ్ నిర్ధారించబడింది! 🎉",cancelSuccess:"బుకింగ్ రద్దు చేయబడింది",onePerDay:"ఈ తేదీకి బుకింగ్ ఉంది!",adminLogin:"అడ్మిన్ లాగిన్",userLogin:"యూజర్ లాగిన్",allBookings:"అన్ని బుకింగ్‌లు",slotManager:"స్లాట్ మేనేజర్",userManager:"యూజర్ మేనేజర్",overview:"అవలోకనం" },
  ta: { welcome:"வரவேற்கிறோம்",unit:"4213 யூஆர்சி என்சிசி குழு, கர்நூல்",tagline:"இ-ஸ்லாட் இங்கே பதிவு செய்யுங்கள்",motto:"ஒற்றுமை மற்றும் ஒழுக்கம்",nonMemberNote:"உறுப்பினர் அல்லாதவர்கள் மளிகை மட்டுமே பதிவு செய்யலாம்.",servingNote:"சேவையில் உள்ளவர்கள் மதுபானத்திற்கு OIC ஐ தொடர்பு கொள்ளவும்.",grocery:"மளிகை",liquor:"மதுபானம்",both:"இரண்டும்",myBookings:"என் பதிவுகள் / ரத்து",downloadApp:"ஆப் பதிவிறக்கம்",myProfile:"என் சுயவிவரம்",liquorNote:"குறிப்பு: என்சிசி பதிவு செய்தவர்கள் மட்டுமே மதுபானம் பதிவு செய்யலாம்",aboutUs:"எங்களை பற்றி",aboutText:"தலைவர் மற்றும் யூஆர்சி ஜிபி தலைமையகத்தின் அனைத்து ஊழியர்களும் வீரர்கள், போர் விதவைகள் மற்றும் சேவையில் உள்ளவர்களுக்கு அனைத்து பிராண்டுகளையும் வழங்கி அதிகபட்ச திருப்தி அளிக்க இடைவிடாது முயற்சிக்கின்றனர்.",signIn:"உள்நுழை",register:"பதிவு",forgotPwd:"கடவுச்சொல் மறந்தீர்களா",email:"மின்னஞ்சல்",password:"கடவுச்சொல்",name:"உங்கள் பெயர்",choosePwd:"கடவுச்சொல் தேர்வு",rememberMe:"என்னை நினைவில் வையுங்கள்",login:"உள்நுழைக",bookSlot:"ஸ்லாட் பதிவு",dashboard:"டாஷ்போர்டு",cancel:"ரத்து",viewToken:"டோக்கன் பார்",confirmBooking:"பதிவை உறுதிப்படுத்து",selectCategory:"வகை",selectDate:"தேதி தேர்வு",selectTime:"நேரம் தேர்வு",spotsLeft:"இடங்கள்",full:"நிரம்பியது",holiday:"விடுமுறை",active:"செயல்பாட்டில்",completed:"முடிந்தது",cancelled:"ரத்தானது",bookingSuccess:"பதிவு உறுதிப்படுத்தப்பட்டது! 🎉",cancelSuccess:"பதிவு ரத்தானது",onePerDay:"இந்த தேதியில் ஏற்கனவே பதிவு உள்ளது!",adminLogin:"நிர்வாக உள்நுழைவு",userLogin:"பயனர் உள்நுழைவு",allBookings:"அனைத்து பதிவுகள்",slotManager:"ஸ்லாட் மேலாளர்",userManager:"பயனர் மேலாளர்",overview:"கண்ணோட்டம்" }
};
// ─────────────────────────────────────────────────────────────────────────────

// ── Theme tokens ──────────────────────────────────────────────────────────────
const L = { bg:"#f5f6f7", card:"#ffffff", text:"#1a1a1a", muted:"#6b7280", border:"#e5e7eb", shadow:"0 2px 12px rgba(0,0,0,0.06)" };
const D = { bg:"#0d1117", card:"#161b22", text:"#f0f6fc", muted:"#8b949e", border:"#30363d", shadow:"0 2px 12px rgba(0,0,0,0.4)" };

const nd = (d: any): string => {
  if (!d) return "";
  if (typeof d === "string" && d.length === 10) return d;
  if (typeof d === "string") return d.slice(0, 10);
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  return String(d).slice(0, 10);
};

const normalizeBooking = (b: any) => ({
  ...b,
  date: nd(b.date || b.slot?.date),
  time: b.time || b.slot?.time || "",
  status: String(b.status || "").toLowerCase(),
});

function getTokenRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));
    return String(decoded?.role || "").toUpperCase() || null;
  } catch {
    return null;
  }
}

const NOTICE_STORAGE_KEY = "urc_notice_board";
// ─────────────────────────────────────────────────────────────────────────────

const LANGS = [
  { code:"en", short:"EN",  name:"English"  },
  { code:"hi", short:"हि",  name:"हिन्दी"   },
  { code:"te", short:"తె",  name:"తెలుగు"   },
  { code:"ta", short:"த",   name:"தமிழ்"    },
];

// ── Helper: is this user an admin? ───────────────────────────────────────────
// Normalises to lowercase so both "admin" and "ADMIN" from the DB work.
const LANG_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
};

function validatePasswordRules(password: string) {
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function PasswordField({ label, value, setValue, visible, setVisible, placeholder, onEnter, inputStyle }: any) {
  const mergedInputStyle = inputStyle || {
    width: "100%",
    padding: "13px 72px 13px 15px",
    border: "2px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    color: "#1a1a1a",
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={onEnter ? (e: any) => e.key === "Enter" && onEnter() : undefined}
          style={mergedInputStyle}
        />
        <button
          type="button"
          onClick={() => setVisible((prev: boolean) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#1F3D2B", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "4px 6px" }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function isAdminUser(user: any) {
  return user?.role?.toLowerCase() === "admin";
}
// ─────────────────────────────────────────────────────────────────────────────

function NccLogo({ size = 80 }: any) {
  return (
    <img
      src="/image.png"
      alt="NCC Logo"
      style={{
        width: size,
        height: size * 1.18,
        objectFit: "contain",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
      }}
    />
  );
}

function Toast({ toasts, remove }: any) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {toasts.map((t: any) => (
        <div
          key={t.id}
          style={{
            background:
              t.type === "success"
                ? "#1F3D2B"
                : t.type === "error"
                ? "#dc2626"
                : "#92400e",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            minWidth: 250,
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            animation: "toastIn 0.3s ease",
          }}
        >
          <span>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "⚠"}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function LangBar({ lang, setLang, dark, compact = false }: any) {
  // Compact (sidebar): show 2-char short labels in a 2×2 grid so all 4 fit
  if (compact) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, width: "100%" }}>
        {LANGS.map((l: any) => {
          const selected = lang === l.code;
          return (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              title={l.name}
              style={{
                padding: "5px 6px",
                borderRadius: 8,
                border: selected
                  ? "1px solid #c9a84c"
                  : "1px solid rgba(255,255,255,0.12)",
                background: selected ? "#c9a84c" : "rgba(255,255,255,0.06)",
                color: selected ? "#1a1a1a" : "rgba(255,255,255,0.85)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              {l.short}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 12,
        background: dark ? "rgba(255,255,255,0.96)" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid #e5e7eb",
        boxShadow: dark ? "0 10px 24px rgba(0,0,0,0.18)" : "0 8px 22px rgba(15,23,42,0.08)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>
        
      </span>
      <select
        value={lang}
        onChange={(e: any) => setLang(e.target.value)}
        style={{
          border: "none",
          background: "transparent",
          color: "#111827",
          fontSize: 14,
          fontWeight: 700,
          outline: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
          paddingRight: 8,
        }}
      >
        {LANGS.map((l: any) => (
          <option key={l.code} value={l.code}>
            {l.code.toUpperCase()} - {LANG_LABELS[l.code] || l.code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Sidebars ─────────────────────────────────────────────────────────────────
function UserSidebar({ active, onNav, user, onLogout, dark, lang, setLang }: any) {
  const t = (T as any)[lang];
  const items = [
    { id: "dashboard", label: t.dashboard, icon: "⊞" },
    { id: "book", label: t.bookSlot, icon: "📅" },
    { id: "bookings", label: "My Bookings", icon: "🎫" },
    { id: "profile", label: t.myProfile, icon: "👤" },
  ];
  return (
    <div
      style={{
        width: 230,
        minHeight: "100vh",
        background: dark ? "#0d1a12" : "#1F3D2B",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "20px 18px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NccLogo size={34} />
          <div>
            <div
              style={{ color: "#fff", fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}
            >
              4213 URC NCC
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>Kurnool</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 9px" }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              width: "100%",
              padding: "11px 12px",
              background: active === item.id ? "rgba(255,255,255,0.12)" : "none",
              border: "none",
              borderRadius: 10,
              color: active === item.id ? "#fff" : "rgba(255,255,255,0.58)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active === item.id ? 600 : 400,
              marginBottom: 2,
              textAlign: "left",
              fontFamily: "'DM Sans',sans-serif",
              borderLeft: active === item.id ? "3px solid #c9a84c" : "3px solid transparent",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div
        style={{
          padding: "12px 9px 16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: 6,
              paddingLeft: 4,
            }}
          >
            LANGUAGE
          </p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <LangBar lang={lang} setLang={setLang} dark={true} compact={true} />
          </div>
        </div>
        <div
          style={{
            padding: "10px 11px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
            marginBottom: 7,
          }}
        >
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>{user?.name}</div>
          <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 10, marginTop: 1 }}>
            {user?.regiment}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "9px",
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 10,
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

function AdminSidebar({ active, onNav, user, onLogout, dark }: any) {
  // Only Slot Manager and User Manager (no All Bookings link)
  const items = [
    { id: "admin-dashboard", label: "Overview", icon: "📊" },
    { id: "admin-slots", label: "Slot Manager", icon: "⚙️" },
    { id: "admin-users", label: "User Manager", icon: "👥" },
  ];
  return (
    <div
      style={{
        width: 230,
        minHeight: "100vh",
        background: dark ? "#1a0a00" : "#2c1000",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "20px 18px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <NccLogo size={34} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>
              Admin Panel
            </div>
            <div style={{ color: "rgba(249,115,22,0.7)", fontSize: 9 }}>
              4213 URC NCC
            </div>
          </div>
        </div>
        <div
          style={{
            background: "rgba(249,115,22,0.18)",
            border: "1px solid rgba(249,115,22,0.35)",
            borderRadius: 6,
            padding: "3px 9px",
            display: "inline-block",
          }}
        >
          <span style={{ fontSize: 9, color: "#fb923c", fontWeight: 700 }}>
            🔐 ADMIN ACCESS
          </span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 9px" }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              width: "100%",
              padding: "11px 12px",
              background:
                active === item.id ? "rgba(249,115,22,0.14)" : "none",
              border: "none",
              borderRadius: 10,
              color: active === item.id ? "#fff" : "rgba(255,255,255,0.58)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active === item.id ? 600 : 400,
              marginBottom: 2,
              textAlign: "left",
              fontFamily: "'DM Sans',sans-serif",
              borderLeft:
                active === item.id
                  ? "3px solid #f97316"
                  : "3px solid transparent",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div
        style={{
          padding: "12px 9px 16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            padding: "10px 11px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
            marginBottom: 7,
          }}
        >
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>
            {user?.name}
          </div>
          <div style={{ color: "#f97316", fontSize: 9, fontWeight: 700, marginTop: 1 }}>
            ADMINISTRATOR
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "9px",
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 10,
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Home page ─────────────────────────────────────────────────────────────────
function HomePage({ onGoAuth, lang, setLang }: any) {
  const t = (T as any)[lang];
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f5f6f7" }}>
      <div style={{ background: "#1F3D2B", color: "#fff", padding: "9px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>📞 Contact OIC for Liquor Drawl with Leave Certificate</span>
        <LangBar lang={lang} setLang={setLang} dark={true} />
      </div>
      <div style={{ background: "linear-gradient(160deg,#0d2016 0%,#1F3D2B 55%,#2d5a3d 100%)", color: "#fff", padding: "64px 20px 90px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(201,168,76,0.05)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(201,168,76,0.04)" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", animation: "fadeUp 0.7s ease" }}>
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 22, filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.45))" }}>
            <NccLogo size={120} />
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#c9a84c", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{t.welcome}</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(20px,5vw,36px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>{t.unit}</h1>
          <div style={{ width: 56, height: 3, background: "linear-gradient(90deg,#c9a84c,#f0d080)", margin: "14px auto 18px", borderRadius: 2 }} />
          <p style={{ fontSize: "clamp(15px,3vw,20px)", color: "rgba(255,255,255,0.85)", fontWeight: 500, marginBottom: 6 }}>{t.tagline}</p>
          <p style={{ fontSize: 13, color: "#c9a84c", letterSpacing: "0.08em" }}>{t.motto}</p>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "-32px auto 0", padding: "0 20px", position: "relative", zIndex: 10 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 26px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", borderLeft: "5px solid #c9a84c" }}>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 8, lineHeight: 1.75, wordBreak: "break-word" }}>⚠️ {t.nonMemberNote}</p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, wordBreak: "break-word" }}>📋 {t.servingNote}</p>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 20px" }}>
        <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#1F3D2B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 22 }}>— Quick Book —</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 14, marginBottom: 14 }}>
          {[{ label: t.grocery, icon: "🛒", c: "#1F3D2B" }, { label: t.liquor, icon: "🥃", c: "#92400e" }, { label: t.both, icon: "🛒🥃", c: "#1e3a5f" }].map((x) => (
            <button key={x.label} onClick={() => onGoAuth("user")} style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 18, padding: "22px 14px", cursor: "pointer", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" }}
              onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = x.c; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.13)"; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{x.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: x.c, marginBottom: 3 }}>{x.label}</div>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginBottom: 16 }}>
          {[{ label: t.myBookings, icon: "🎫" }, { label: t.downloadApp, icon: "📱" }, { label: t.myProfile, icon: "👤" }].map((x) => (
            <button key={x.label} onClick={() => onGoAuth("user")} style={{ background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 13, padding: "13px 10px", cursor: "pointer", textAlign: "center", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 12px rgba(31,61,43,0.28)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <span>{x.icon}</span><span>{x.label}</span>
            </button>
          ))}
        </div>
        <div style={{ background: "#fef3c7", border: "1.5px solid #f59e0b", borderRadius: 12, padding: "11px 18px", textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>⭐ {t.liquorNote}</p>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
          <button onClick={() => onGoAuth("user")} style={{ flex: 1, minWidth: 160, background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 14, padding: "16px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(31,61,43,0.3)" }}>
            👤 {t.userLogin}
          </button>
          <button onClick={() => onGoAuth("admin")} style={{ flex: 1, minWidth: 160, background: "linear-gradient(135deg,#7c2d12,#b45309)", border: "none", borderRadius: 14, padding: "16px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(124,45,18,0.3)" }}>
            🔐 {t.adminLogin}
          </button>
        </div>
      </div>
      <div style={{ background: "#1F3D2B", color: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><NccLogo size={60} /></div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#c9a84c" }}>{t.aboutUs}</h2>
          <div style={{ width: 48, height: 2, background: "#c9a84c", margin: "0 auto 22px", borderRadius: 1 }} />
          <p style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(255,255,255,0.82)" }}>{t.aboutText}</p>
        </div>
      </div>
      <div style={{ background: "#0d2016", color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "18px", fontSize: 12 }}>
        © 2026 4213 URC NCC Group, Kurnool · All rights reserved
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth screen ───────────────────────────────────────────────────────────────
function AuthScreen({ mode, onLogin, onBack, lang, setLang }: any) {
  const t = (T as any)[lang], isAdmin = mode === "admin";
  const resetToken = new URLSearchParams(window.location.search).get("resetToken");
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState(""), [pwd, setPwd] = useState(""), [err, setErr] = useState(""), [loading, setLoading] = useState(false);
  const [rName, setRName] = useState(""), [rEmail, setREmail] = useState(""), [rPwd, setRPwd] = useState(""), [rRegiment, setRRegiment] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPwd, setResetPwd] = useState("");
  const [resetConfirmPwd, setResetConfirmPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegisterPwd, setShowRegisterPwd] = useState(false);
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [showResetConfirmPwd, setShowResetConfirmPwd] = useState(false);
  const passwordRules = validatePasswordRules(rPwd);
  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const resetPasswordRules = validatePasswordRules(resetPwd);
  const isResetPasswordValid = Object.values(resetPasswordRules).every(Boolean);
  const fieldStyle = { width: "100%", padding: "13px 15px", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif", color: "#1a1a1a", boxSizing: "border-box" as const };
  const passwordFieldStyle = { ...fieldStyle, padding: "13px 72px 13px 15px" };

  useEffect(() => { setErr(""); }, [tab]);
  useEffect(() => { setEmail(""); setPwd(""); setErr(""); }, []);
  useEffect(() => {
    if (resetToken && !isAdmin) {
      setTab("forgot");
    }
  }, [resetToken, isAdmin]);

  const doLogin = async () => {
    try {
      setErr("");
      const res = await API.post("/auth/login", { email, password: pwd });
      const role = String(res?.data?.user?.role || "").toLowerCase();

      if (isAdmin && role !== "admin") {
        localStorage.removeItem("token");
        setErr("This page is for admin accounts only. Use User Login.");
        return;
      }

      if (!isAdmin && role === "admin") {
        localStorage.removeItem("token");
        setErr("Admins must sign in from the Admin Login page.");
        return;
      }

      if (res.data.token) localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);
    } catch (err: any) {
      setErr(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials"
      );
    }
  };

  const doRegisterImproved = async () => {
    try {
      setErr("");
      if (!isPasswordValid) {
        setErr("Password does not meet the required rules.");
        return;
      }
      const res = await API.post("/auth/register", { name: rName, email: rEmail, password: rPwd, regiment: rRegiment });
      if (res && res.data && res.data.success) {
        try {
          const loginRes = await API.post("/auth/login", { email: rEmail, password: rPwd });
          if (loginRes?.data?.token) {
            localStorage.setItem("token", loginRes.data.token);
            onLogin(loginRes.data.user);
          } else {
            setTab("signin");
          }
        } catch {
          setTab("signin");
        }
      } else {
        setErr(res?.data?.message || "Registration failed");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Registration failed";
      setErr(msg);
    }
  };

  const doForgotPassword = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email: forgotEmail });
      setErr(res?.data?.message || "Reset link sent if the email exists.");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const doResetPassword = async () => {
    try {
      setErr("");
      if (!resetToken) {
        setErr("Reset token is missing.");
        return;
      }
      if (!isResetPasswordValid) {
        setErr("New password does not meet the required rules.");
        return;
      }
      if (resetPwd !== resetConfirmPwd) {
        setErr("Passwords do not match.");
        return;
      }

      setLoading(true);
      await API.post("/auth/reset-password", { token: resetToken, password: resetPwd });
      window.history.replaceState({}, "", window.location.pathname);
      setResetPwd("");
      setResetConfirmPwd("");
      setShowResetPwd(false);
      setShowResetConfirmPwd(false);
      setTab("signin");
      setErr("Password reset successful. Please sign in.");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: isAdmin ? "linear-gradient(135deg,#1a0800 0%,#3b1500 45%,#6b2d00 100%)" : "linear-gradient(160deg,#0d2016 0%,#1F3D2B 55%,#2d5a3d 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "7px 16px", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Home</button>
          <LangBar lang={lang} setLang={setLang} dark={true} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 14, filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.4))" }}><NccLogo size={80} /></div>
          <h1 style={{ color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: 21, marginBottom: 4 }}>{isAdmin ? t.adminLogin : t.userLogin}</h1>
          <p style={{ color: isAdmin ? "#fb923c" : "#c9a84c", fontSize: 12 }}>{t.unit}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.38)" }}>
          {!isAdmin && (
            <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
              {[{ id: "signin", label: t.signIn, icon: "🔒" }, { id: "register", label: t.register, icon: "✏️" }, { id: "forgot", label: t.forgotPwd, icon: "🔑" }].map((tb) => (
                <button key={tb.id} onClick={() => { setTab(tb.id); setErr(""); }} style={{ flex: 1, padding: "13px 4px", border: "none", background: tab === tb.id ? "#fff" : "#f9fafb", borderBottom: tab === tb.id ? "3px solid #1F3D2B" : "3px solid transparent", color: tab === tb.id ? "#1F3D2B" : "#999", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <span>{tb.icon}</span><span>{tb.label}</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ padding: 30 }}>
            {isAdmin && <div style={{ textAlign: "center", marginBottom: 18, fontSize: 12, background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 10, padding: "9px 14px", color: "#92400e", fontWeight: 600 }}>🔐 Restricted Access — Admin Only</div>}
            {(tab === "signin" || isAdmin) && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{t.email}</label>
                  <input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="Enter email" onKeyDown={(e: any) => e.key === "Enter" && doLogin()} style={fieldStyle} onFocus={(e: any) => e.target.style.borderColor = "#1F3D2B"} onBlur={(e: any) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <PasswordField label={t.password} value={pwd} setValue={setPwd} visible={showLoginPwd} setVisible={setShowLoginPwd} placeholder="Password" onEnter={doLogin} inputStyle={passwordFieldStyle} />
                {!isAdmin && <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, cursor: "pointer" }}><input type="checkbox" style={{ width: 15, height: 15 }} /><span style={{ fontSize: 13, color: "#555" }}>{t.rememberMe}</span></label>}
                {err && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "9px 14px", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>{err}</div>}
                <button onClick={doLogin} disabled={loading} style={{ width: "100%", padding: "14px", background: isAdmin ? "linear-gradient(135deg,#92400e,#b45309)" : "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  {loading ? "Verifying…" : t.login}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14 }}>{isAdmin ? "Use an account with admin role." : "Demo: suresh@urc.in / user123"}</p>
              </>
            )}
            {tab === "register" && !isAdmin && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 20 }}>{t.register}</h2>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{t.name}</label>
                  <input type="text" value={rName} onChange={(e: any) => setRName(e.target.value)} placeholder="Full Name" style={fieldStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{t.email}</label>
                  <input type="email" value={rEmail} onChange={(e: any) => setREmail(e.target.value)} placeholder="Email" style={fieldStyle} />
                </div>
                <PasswordField label={t.choosePwd} value={rPwd} setValue={setRPwd} visible={showRegisterPwd} setVisible={setShowRegisterPwd} placeholder="Password" />
                <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                    Password Rules
                  </div>
                  {[
                    { ok: passwordRules.minLength, label: "At least 8 characters" },
                    { ok: passwordRules.upper, label: "One uppercase letter" },
                    { ok: passwordRules.lower, label: "One lowercase letter" },
                    { ok: passwordRules.number, label: "One number" },
                    { ok: passwordRules.special, label: "One special character" },
                  ].map((rule) => (
                    <div key={rule.label} style={{ fontSize: 12, color: rule.ok ? "#166534" : "#6b7280", marginBottom: 5 }}>
                      {rule.ok ? "[OK]" : "[ ]"} {rule.label}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Regiment / Unit</label>
                  <select value={rRegiment} onChange={(e: any) => setRRegiment(e.target.value)} style={{ width: "100%", padding: "13px 15px", border: `2px solid ${!rRegiment && err ? "#fecaca" : "#e5e7eb"}`, borderRadius: 12, fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif", color: rRegiment ? "#1a1a1a" : "#999", background: "#fff", boxSizing: "border-box", cursor: "pointer" }}>
                    <option value="">— Select your Regiment —</option>
                    <option value="Infantry">Infantry</option>
                    <option value="Armoured Corps">Armoured Corps</option>
                    <option value="Artillery">Artillery</option>
                    <option value="Signals">Signals</option>
                    <option value="Engineers">Engineers</option>
                    <option value="Army Service Corps">Army Service Corps</option>
                    <option value="Army Medical Corps">Army Medical Corps</option>
                    <option value="Ordnance Corps">Ordnance Corps</option>
                    <option value="Electrical & Mechanical Engineers">Electrical &amp; Mechanical Engineers</option>
                    <option value="Intelligence Corps">Intelligence Corps</option>
                    <option value="4213 URC NCC">4213 URC NCC Staff</option>
                    <option value="Veteran">Veteran</option>
                    <option value="War Widow">War Widow</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {err && <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "9px 14px", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>{err}</div>}
                <button onClick={doRegisterImproved} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{loading ? "Registering…" : t.register}</button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#999", marginTop: 12 }}>Account requires admin approval before activation.</p>
              </>
            )}
            {tab === "forgot" && !isAdmin && (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 10 }}>{resetToken ? "Reset Password" : t.forgotPwd}</h2>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 22, lineHeight: 1.6 }}>
                  {resetToken ? "Enter your new password below." : "Enter your email to receive a reset link."}
                </p>
                {!resetToken ? (
                  <>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{t.email}</label>
                      <input type="email" value={forgotEmail} onChange={(e: any) => setForgotEmail(e.target.value)} placeholder="Email" style={fieldStyle} />
                    </div>
                    <button onClick={doForgotPassword} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{loading ? "Sending..." : "Send Reset Link"}</button>
                  </>
                ) : (
                  <>
                    <PasswordField label="New Password" value={resetPwd} setValue={setResetPwd} visible={showResetPwd} setVisible={setShowResetPwd} placeholder="New Password" inputStyle={passwordFieldStyle} />
                    <PasswordField label="Confirm Password" value={resetConfirmPwd} setValue={setResetConfirmPwd} visible={showResetConfirmPwd} setVisible={setShowResetConfirmPwd} placeholder="Confirm Password" inputStyle={passwordFieldStyle} />
                    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Password Rules</div>
                      {[
                        { ok: resetPasswordRules.minLength, label: "At least 8 characters" },
                        { ok: resetPasswordRules.upper, label: "One uppercase letter" },
                        { ok: resetPasswordRules.lower, label: "One lowercase letter" },
                        { ok: resetPasswordRules.number, label: "One number" },
                        { ok: resetPasswordRules.special, label: "One special character" },
                      ].map((rule) => (
                        <div key={rule.label} style={{ fontSize: 12, color: rule.ok ? "#166534" : "#6b7280", marginBottom: 5 }}>
                          {rule.ok ? "[OK]" : "[ ]"} {rule.label}
                        </div>
                      ))}
                    </div>
                    <button onClick={doResetPassword} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{loading ? "Resetting..." : "Reset Password"}</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Book Slot ─────────────────────────────────────────────────────────────────
// ── Book Slot ─────────────────────────────────────────────────────────────────
// Step 2 uses a full month-grid calendar (like a real calendar app).
// Users can navigate month-by-month across any future date.
// Only days that have slots added by admin are highlighted and clickable.
// Days in the past, with no slots, fully disabled, or fully booked are greyed.
function BookSlot({ lang }: any) {
  const { currentUser, slots, bookings, showToast, updateSlots, updateBookings } = useApp(), t = (T as any)[lang];
  const [step,    setStep]    = useState(1);
  const [cat,     setCat]     = useState("");
  // Convert Prisma enum value back to human-readable label for display
  const catLabel = (v: string) =>
    v === "GROCERY"            ? "Grocery"
  : v === "LIQUOR_ONLY"        ? "Liquor Only"
  : v === "GROCERY_AND_LIQUOR" ? "Grocery + Liquor"
  : v;
  const [selDate, setSelDate] = useState("");
  const [selSlot, setSelSlot] = useState<any>(null);

  // Calendar view state — starts on the current month
  const todayObj = new Date();
  // FIX 1: Use LOCAL date parts, not UTC (toISOString gives UTC which is wrong
  // in India — UTC+5:30 means before 5:30 AM the UTC date is yesterday).
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth()+1).padStart(2,"0")}-${String(todayObj.getDate()).padStart(2,"0")}`;
  const [calYear,  setCalYear]  = useState(todayObj.getFullYear());
  const [calMonth, setCalMonth] = useState(todayObj.getMonth()); // 0-indexed

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Month navigation — cannot go before the current month
  const atMinMonth = calYear === todayObj.getFullYear() && calMonth === todayObj.getMonth();
  const prevMonth  = () => {
    if (atMinMonth) return;
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // Build the 7-column grid: empty leading cells + each day number
  const firstDow    = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const gridCells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Zero-padded "YYYY-MM-DD" for a day in the current calendar view
  const toDateStr = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

  // FIX 2: DB may return dates as:
  //   • plain string "2026-03-22"
  //   • ISO string   "2026-03-22T00:00:00.000Z"
  //   • JS Date object (when parsed by some HTTP clients)
  // Normalise ALL of these to "YYYY-MM-DD" so comparisons always work.
  const nd = (d: any): string => {
    if (!d) return "";
    // Already a plain date string (10 chars)
    if (typeof d === "string" && d.length === 10) return d;
    // ISO string with time part — slice first 10 chars
    if (typeof d === "string") return d.slice(0, 10);
    // JS Date object — use local date parts to avoid UTC offset issues
    if (d instanceof Date) {
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    }
    // Fallback: convert to string and slice
    return String(d).slice(0, 10);
  };

  // Summarise slots for a date string
  // Uses nd() to normalise all date formats before comparing
  const slotInfo = (dateStr: string) => {
    const ds       = slots.filter((s: any) => nd(s.date) === dateStr);
    const hasSlots = ds.length > 0;
    const isHol    = hasSlots && ds.every((s: any) => s.disabled === true);
    const isFull   = hasSlots && !isHol && ds.every((s: any) => (s.booked || 0) >= s.capacity);
    const avail    = ds.filter((s: any) => s.disabled !== true && (s.booked || 0) < s.capacity).length;
    return { hasSlots, isHol, isFull, avail };
  };

  const dateSlots     = selDate ? slots.filter((s: any) => nd(s.date) === selDate) : [];
  const alreadyBooked = selDate && bookings.some((b: any) => b.userId === currentUser.id && nd(b.date) === selDate && b.status === "active");

  const confirm = async () => {
    if (alreadyBooked) { showToast(t.onePerDay, "error"); return; }

    // Pre-flight: warn if the user account is pending/disabled
    if (currentUser?.status === "pending") {
      showToast("Your account is pending admin approval. You cannot book yet.", "error");
      return;
    }
    if (currentUser?.status === "disabled") {
      showToast("Your account has been disabled. Contact admin.", "error");
      return;
    }

    try {
      await API.post("/bookings", { slotId: selSlot.id, category: cat });
      const [slotsRes, bookingsRes] = await Promise.all([
        API.get("/slots"),
        API.get("/bookings"),
      ]);
      updateSlots(slotsRes.data.data);
      updateBookings(bookingsRes.data.data.map(normalizeBooking));
      showToast(t.bookingSuccess, "success");
      setStep(5);
    } catch (err: any) {
      // Show the actual server error message so the user knows what went wrong
      const msg = err?.response?.data?.message
               || err?.response?.data?.error
               || err?.message
               || "Booking failed";
      showToast(msg, "error");
      console.error("Booking error:", err?.response?.data || err);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 23, fontWeight: 800, margin: "0 0 4px", color: "var(--text)" }}>{t.bookSlot}</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 22px", fontSize: 13 }}>Reserve your canteen slot in a few steps</p>

      {/* Step progress bar */}
      {step < 5 && (
        <div style={{ display: "flex", background: "var(--card)", borderRadius: 11, padding: 4, marginBottom: 24, boxShadow: "var(--shadow)" }}>
          {[t.selectCategory, t.selectDate, t.selectTime, t.confirmBooking].map((l: any, i: any) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "7px 3px", borderRadius: 8, background: step === i+1 ? "#1F3D2B" : "none", color: step === i+1 ? "#fff" : step > i+1 ? "#1F3D2B" : "var(--muted)", fontSize: 10, fontWeight: step === i+1 ? 700 : 400 }}>
              {step > i+1 ? "✓ " : ""}{l}
            </div>
          ))}
        </div>
      )}

      {/* ── Step 1: Category ── */}
      {step === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 13 }}>
          {[
            { id: "GROCERY",           label: "Grocery",           icon: "🛒",    desc: "Open to all" },
            { id: "LIQUOR_ONLY",       label: "Liquor Only",       icon: "🥃",    desc: "Registered members" },
            { id: "GROCERY_AND_LIQUOR",label: "Grocery + Liquor",  icon: "🛒🥃",  desc: "Combined" },
          ].map((c: any) => (
            <button key={c.id} onClick={() => { setCat(c.id); setStep(2); }}
              style={{ background: "var(--card)", border: "2px solid var(--border)", borderRadius: 16, padding: "22px 16px", cursor: "pointer", textAlign: "left", boxShadow: "var(--shadow)", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
              onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = "#1F3D2B"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 32, marginBottom: 11 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{c.desc}</div>
              <div style={{ color: "#1F3D2B", fontWeight: 600, fontSize: 12 }}>Select →</div>
            </button>
          ))}
        </div>
      )}

      {/* ── Step 2: Full Calendar Date Picker ── */}
      {step === 2 && (
        <div>
          {/* Debug + empty state banner */}
          {slots.length === 0 ? (
            <div style={{ background: "#fef3c7", border: "1.5px solid #f59e0b", borderRadius: 12, padding: "11px 16px", marginBottom: 16, fontSize: 13, color: "#92400e", fontWeight: 500 }}>
              ⚠️ No slots have been added by admin yet. Please check back later.
            </div>
          ) : (
            <div style={{ background: "var(--card)", borderRadius: 10, padding: "8px 14px", marginBottom: 12, fontSize: 11, color: "var(--muted)", border: "1px solid var(--border)" }}>
              📊 {slots.length} slot{slots.length !== 1 ? "s" : ""} loaded · Dates: {[...new Set(slots.map((s: any) => nd(s.date)))].sort().join(", ")}
            </div>
          )}
          {/* Calendar card */}
          <div style={{ background: "var(--card)", borderRadius: 18, boxShadow: "var(--shadow)", overflow: "hidden", maxWidth: 460 }}>

            {/* Month / year header with prev/next */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={prevMonth}
                disabled={atMinMonth}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, width: 34, height: 34, cursor: atMinMonth ? "not-allowed" : "pointer", color: "var(--text)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", opacity: atMinMonth ? 0.25 : 1, fontFamily: "'DM Sans',sans-serif" }}
              >‹</button>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{MONTH_NAMES[calMonth]}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{calYear}</div>
              </div>

              <button
                onClick={nextMonth}
                style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "var(--text)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}
              >›</button>
            </div>

            {/* Day-of-week labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 14px 2px" }}>
              {DAY_NAMES.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--muted)", padding: "4px 0", letterSpacing: "0.03em" }}>{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, padding: "4px 14px 18px" }}>
              {gridCells.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} />;

                const dateStr = toDateStr(day);
                // FIX 3: Use < strictly so today itself is allowed, not disabled.
                // "2026-03-22" < "2026-03-22" is false, so today is never "past".
                const isPast  = dateStr < todayStr;
                const isToday = dateStr === todayStr;
                const isSel   = dateStr === selDate;
                const { hasSlots, isHol, isFull, avail } = slotInfo(dateStr);

                // Disable: strictly past, no slots yet, holiday, fully booked
                const disabled = isPast || !hasSlots || isHol || isFull;

                // Dot colour: green = available, amber = full, red = holiday
                const dot = !hasSlots ? "transparent"
                          : isHol    ? "#ef4444"
                          : isFull   ? "#f59e0b"
                          :            "#22c55e";

                const tooltipText =
                  isPast    ? "Past date"
                : !hasSlots ? "No slots added yet"
                : isHol     ? "Holiday / Closed"
                : isFull    ? "Fully booked"
                : `${avail} slot${avail !== 1 ? "s" : ""} available`;

                return (
                  <button
                    key={dateStr}
                    onClick={() => { if (!disabled) { setSelDate(dateStr); setStep(3); } }}
                    disabled={disabled}
                    title={tooltipText}
                    style={{
                      background:    isSel    ? "#1F3D2B"
                                   : isToday  ? "rgba(31,61,43,0.09)"
                                   :            "none",
                      border:        isSel    ? "2px solid #1F3D2B"
                                   : isToday  ? "2px solid rgba(31,61,43,0.3)"
                                   :            "2px solid transparent",
                      borderRadius:  9,
                      padding:       "7px 2px 5px",
                      cursor:        disabled ? "not-allowed" : "pointer",
                      opacity:       disabled ? 0.3 : 1,
                      textAlign:     "center",
                      display:       "flex",
                      flexDirection: "column",
                      alignItems:    "center",
                      gap:           2,
                      fontFamily:    "'DM Sans',sans-serif",
                      transition:    "all 0.12s",
                      minWidth:      0,
                    }}
                    onMouseEnter={(e: any) => {
                      if (!disabled && !isSel)
                        e.currentTarget.style.background = "rgba(31,61,43,0.07)";
                    }}
                    onMouseLeave={(e: any) => {
                      if (!disabled && !isSel)
                        e.currentTarget.style.background = isToday ? "rgba(31,61,43,0.09)" : "none";
                    }}
                  >
                    {/* Date number */}
                    <span style={{ fontSize: 13, fontWeight: (isSel || isToday) ? 700 : 400, color: isSel ? "#fff" : "var(--text)", lineHeight: 1 }}>
                      {day}
                    </span>
                    {/* Status dot */}
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: isSel ? "rgba(255,255,255,0.65)" : dot, display: "block" }} />
                    {/* Slot count — only when available */}
                    {!disabled && avail > 0 && (
                      <span style={{ fontSize: 8, color: isSel ? "rgba(255,255,255,0.85)" : "#1F3D2B", fontWeight: 700, lineHeight: 1 }}>
                        {avail}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
            {[
              { c: "#22c55e", l: "Available" },
              { c: "#f59e0b", l: "Fully booked" },
              { c: "#ef4444", l: "Holiday / Closed" },
            ].map(({ c: dc, l }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: dc, display: "inline-block" }} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{l}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(1)} style={{ marginTop: 18, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        </div>
      )}

      {/* ── Step 3: Time slot picker ── */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{t.selectTime}</h2>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>{selDate} — {catLabel(cat)}</p>
          {alreadyBooked && (
            <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: 11, padding: "10px 14px", marginBottom: 16, color: "#92400e", fontSize: 13, fontWeight: 500 }}>
              ⚠️ {t.onePerDay}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 11 }}>
            {dateSlots.map((slot: any) => {
              const rem = slot.capacity - slot.booked, pct = (slot.booked / slot.capacity) * 100, isFull = rem <= 0;
              return (
                <button key={slot.id}
                  onClick={() => { if (!isFull && !slot.disabled) { setSelSlot(slot); setStep(4); } }}
                  disabled={isFull || slot.disabled}
                  style={{ background: "var(--card)", border: `2px solid ${isFull ? "#fecaca" : "var(--border)"}`, borderRadius: 15, padding: "17px 15px", cursor: isFull ? "not-allowed" : "pointer", opacity: isFull ? 0.5 : 1, textAlign: "left", boxShadow: "var(--shadow)", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}
                  onMouseEnter={(e: any) => { if (!isFull) { e.currentTarget.style.borderColor = "#1F3D2B"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = isFull ? "#fecaca" : "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 7 }}>{slot.time}</div>
                  <div style={{ height: 4, background: "#e5e7eb", borderRadius: 3, marginBottom: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#22c55e", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: isFull ? "#ef4444" : "#16a34a", fontWeight: 600 }}>{isFull ? t.full : `${rem} ${t.spotsLeft}`}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{slot.booked}/{slot.capacity} booked</div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep(2)} style={{ marginTop: 16, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        </div>
      )}

      {/* ── Step 4: Confirm ── */}
      {step === 4 && selSlot && (
        <div style={{ maxWidth: 420 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>{t.confirmBooking}</h2>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 22, boxShadow: "var(--shadow)", marginBottom: 16 }}>
            {[["Name", currentUser.name], ["Category", catLabel(cat)], ["Date", selDate], ["Time", selSlot.time], ["Spots Available", `${selSlot.capacity - selSlot.booked}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={confirm} style={{ width: "100%", background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 9 }}>✓ {t.confirmBooking}</button>
          <button onClick={() => setStep(3)} style={{ width: "100%", background: "none", border: "2px solid var(--border)", borderRadius: 12, padding: "12px", color: "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        </div>
      )}

      {/* ── Step 5: Success ── */}
      {step === 5 && (
        <div style={{ textAlign: "center", maxWidth: 380, margin: "0 auto" }}>
          <div style={{ width: 68, height: 68, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px" }}>✓</div>
          <h2 style={{ fontSize: 21, fontWeight: 800, color: "var(--text)", marginBottom: 7 }}>Booking Confirmed!</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 22 }}>View your token in My Bookings</p>
          <button onClick={() => setStep(1)} style={{ background: "#1F3D2B", border: "none", borderRadius: 11, padding: "12px 26px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Book Another</button>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── My Bookings ───────────────────────────────────────────────────────────────
function MyBookings({ lang }: any) {
  const { currentUser, bookings, showToast, updateBookings, updateSlots } = useApp(), t = (T as any)[lang];
  const [filter, setFilter] = useState("all"), [tv, setTv] = useState<any>(null);
  const my = bookings.filter((b: any) => b.userId === currentUser.id);
  const fil = filter === "all" ? my : my.filter((b: any) => b.status === filter);
  const sc: any = { active: { bg: "#dcfce7", tx: "#166534" }, completed: { bg: "#dbeafe", tx: "#1e40af" }, cancelled: { bg: "#fee2e2", tx: "#991b1b" } };
  return (
    <div>
      <h1 style={{ fontSize: 23, fontWeight: 800, margin: "0 0 4px", color: "var(--text)" }}>My Bookings</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: 13 }}>Your canteen slot history</p>
      <div style={{ display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "active", "completed", "cancelled"].map((f: any) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 15px", borderRadius: 20, border: "2px solid", borderColor: filter === f ? "#1F3D2B" : "var(--border)", background: filter === f ? "#1F3D2B" : "var(--card)", color: filter === f ? "#fff" : "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>
      {fil.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 42, marginBottom: 9 }}>🎫</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>No bookings found</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Bookings appear here once created</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {fil.map((b: any) => (
            <div key={b.id} style={{ background: "var(--card)", borderRadius: 15, padding: "17px 20px", boxShadow: "var(--shadow)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 170 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{b.category}</span>
                  <span style={{ background: sc[b.status].bg, color: sc[b.status].tx, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase" }}>{b.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>📅 {b.date} · ⏰ {b.time}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Token: {b.tokenNo}</div>
              </div>
              {b.status === "active" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setTv(b)} style={{ background: "#1F3D2B", border: "none", borderRadius: 9, padding: "8px 15px", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{t.viewToken}</button>
                  <button onClick={async () => { try { await API.delete(`/bookings/${b.id}`); const [slotsRes, bookingsRes] = await Promise.all([API.get("/slots"), API.get("/bookings")]); updateSlots(slotsRes.data.data); updateBookings(bookingsRes.data.data.map(normalizeBooking)); showToast(t.cancelSuccess, "warning"); } catch (err: any) { showToast(err?.response?.data?.message || "Cancel failed", "error"); } }} style={{ background: "none", border: "2px solid #fecaca", borderRadius: 9, padding: "8px 15px", color: "#ef4444", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{t.cancel}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tv && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setTv(null)}>
          <div onClick={(e: any) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 22, padding: 28, maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 32px 64px rgba(0,0,0,0.32)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><NccLogo size={26} /><span style={{ fontSize: 11, fontWeight: 700, color: "#1F3D2B" }}>URC KURNOOL</span></div>
              <button onClick={() => setTv(null)} style={{ background: "#f5f5f5", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 15 }}>×</button>
            </div>
            <div style={{ background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", borderRadius: 16, padding: "26px 22px", color: "#fff", marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "#c9a84c", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 5 }}>ENTRY TOKEN</div>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.04em", marginBottom: 5 }}>{tv.tokenNo}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 13 }}>{tv.category}</div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 11px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "left" }}><div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>DATE</div><div style={{ fontSize: 11, fontWeight: 700 }}>{tv.date}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>TIME</div><div style={{ fontSize: 11, fontWeight: 700 }}>{tv.time}</div></div>
              </div>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: 11, padding: 14, marginBottom: 11 }}>
              <div style={{ width: 76, height: 76, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
                {Array.from({ length: 49 }, (_, i) => <div key={i} style={{ background: Math.sin(i * 3.7 + 1) > 0 ? "#1F3D2B" : "transparent", borderRadius: 1 }} />)}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>Show at gate · {currentUser?.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── User Profile ──────────────────────────────────────────────────────────────
function UserProfile() {
  const { currentUser } = useApp();
  return (
    <div>
      <h1 style={{ fontSize: 23, fontWeight: 800, margin: "0 0 22px", color: "var(--text)" }}>My Profile</h1>
      <div style={{ background: "var(--card)", borderRadius: 18, padding: 26, boxShadow: "var(--shadow)", maxWidth: 440 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, paddingBottom: 22, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg,#1F3D2B,#2d5a3d)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#fff" }}>👤</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{currentUser.email}</div>
            <span style={{ fontSize: 10, background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 20, fontWeight: 700, display: "inline-block", marginTop: 4 }}>ACTIVE</span>
          </div>
        </div>
        {[["Regiment", currentUser.regiment], ["Role", currentUser.role], ["Member ID", currentUser.id]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState("dashboard");
  const [slots, setSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [toasts, setToasts] = useState<any>([]);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const resetToken = new URLSearchParams(window.location.search).get("resetToken");
    if (resetToken) setScreen("auth-user");
  }, []);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTICE_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setNotices(Array.isArray(parsed) ? parsed : []);
    } catch {
      setNotices([]);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
  }, [notices]);

  const fetchData = async () => {
    // Fetch slots independently — available to all users without auth
    try {
      const sRes = await API.get("/slots");
      setSlots(sRes.data.data);
    } catch (err: any) {
      console.error("Slots fetch error", err?.response?.status, err?.message);
    }

    // Fetch bookings — requires valid auth token
    if (!localStorage.getItem("token")) return;

    try {
      const bRes = await API.get("/bookings");
      setBookings(bRes.data.data.map(normalizeBooking));
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        // Token expired — clear it so user gets redirected to login
        localStorage.removeItem("token");
      }
      console.error("Bookings fetch error", err?.response?.status);
    }

    // Fetch users — only needed for admin; gracefully ignore 403 for regular users
    if (getTokenRole() !== "ADMIN") return;

    try {
      const uRes = await API.get("/users");
      setUsers(uRes.data.data);
    } catch (err: any) {
      console.error("Users fetch error", err?.response?.status);
    }
  };

  const showToast = useCallback((msg: any, type = "success") => {
    const id = Date.now();
    setToasts((t: any) => [...t, { id, message: msg, type }]);
    setTimeout(() => setToasts((t: any) => t.filter((x: any) => x.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id: any) => setToasts((t: any) => t.filter((x: any) => x.id !== id)), []);

  const vars = dark ? D : L;

  // ── ADMIN LOGIN FIX ──
  // Normalise role to lowercase so "ADMIN" from the DB is treated correctly.
  const adminFlag = isAdminUser(currentUser);

  if (screen === "home") return <HomePage onGoAuth={(m: any) => setScreen(`auth-${m}`)} lang={lang} setLang={setLang} />;

  if (screen === "auth-user" || screen === "auth-admin") {
    return (
      <AuthScreen
        mode={screen === "auth-admin" ? "admin" : "user"}
        onLogin={(u: any) => {
          setCurrentUser(u);
          fetchData();
          // Use normalised role check so "ADMIN" and "admin" both work
          setPage(isAdminUser(u) ? "admin-dashboard" : "dashboard");
          setScreen("app");
        }}
        onBack={() => setScreen("home")}
        lang={lang}
        setLang={setLang}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  // ── Page maps ──
  // User pages — imported from UserDashboard.tsx
  const uPages: any = {
    dashboard: <UserDashboard onNav={setPage} lang={lang} t={(T as any)[lang]} />,
    book: <BookSlot lang={lang} />,
    bookings: <MyBookings lang={lang} />,
    profile: <UserProfile />,
  };

  // Admin pages — imported from AdminDashboard.tsx
  const aPages: any = {
    "admin-dashboard": <AdminDashboard />,
    "admin-slots": <AdminSlots />,
    "admin-users": <AdminUsers />,
  };

  return (
    <Ctx.Provider value={{ currentUser, slots, bookings, users, notices, showToast, updateSlots: setSlots, updateUsers: setUsers, updateBookings: setBookings, updateNotices: setNotices }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif}@keyframes toastIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12);border-radius:3px}`}</style>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: `${vars.bg}`,
          "--bg": vars.bg,
          "--card": vars.card,
          "--text": vars.text,
          "--muted": vars.muted,
          "--border": vars.border,
          "--shadow": vars.shadow,
        } as any}
      >
        {adminFlag
          ? <AdminSidebar active={page} onNav={setPage} user={currentUser} onLogout={() => { setCurrentUser(null); setScreen("home"); }} dark={dark} />
          : <UserSidebar active={page} onNav={setPage} user={currentUser} onLogout={() => { setCurrentUser(null); setScreen("home"); }} dark={dark} lang={lang} setLang={setLang} />
        }
        <main
          style={{
            marginLeft: 230,
            flex: 1,
            padding: "32px 32px 60px",
            maxWidth: "calc(100vw - 230px)",
            overflowX: "hidden",
            "--bg": vars.bg,
            "--card": vars.card,
            "--text": vars.text,
            "--muted": vars.muted,
            "--border": vars.border,
            "--shadow": vars.shadow,
          } as any}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 8, alignItems: "center" }}>
            <button onClick={() => setDark((d: any) => !d)} style={{ background: vars.card, border: `2px solid ${vars.border}`, borderRadius: 17, padding: "7px 14px", cursor: "pointer", fontSize: 12, color: vars.text, fontFamily: "'DM Sans',sans-serif", boxShadow: vars.shadow }}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          {adminFlag
            ? (aPages[page] || <AdminDashboard />)
            : (uPages[page] || <UserDashboard onNav={setPage} lang={lang} t={(T as any)[lang]} />)
          }
        </main>
      </div>
      <Toast toasts={toasts} remove={removeToast} />
    </Ctx.Provider>
  );
}
