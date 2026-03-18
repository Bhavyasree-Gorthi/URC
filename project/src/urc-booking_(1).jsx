import { useState, useEffect, createContext, useContext, useCallback } from "react";

const T = {
    : { welcome:"WELCOME TO",unit:"4213 URC NCC GROUP, KURNOOL",tagline:"Book Your E-Slots Here",motto:"Unity and Discipline",nonMemberNote:"Non-Members are only allowed to book Grocery.",servingNote:"All Serving Personnel are requested to contact OIC/Canteen manager for drawl of liquor with Leave Certificate.",grocery:"GROCERY",liquor:"LIQUOR",both:"BOTH",myBookings:"MY BOOKINGS / CANCEL",downloadApp:"DOWNLOAD APP",myProfile:"MY PROFILE",liquorNote:"Note: Only URC NCC Group registered customers can book Liquor",aboutUs:"ABOUT US",aboutText:"Chairman, and all Staff members of URC GP HQ are constantly striving hard to provide utmost satisfaction to Veterans, War Widows, and Serving Pers by ensuring all variety of brands are made available be it Grocery or Liquor items. Our singular aim is to provide utmost satisfaction to our esteemed customers.",signIn:"Sign In",register:"Register",forgotPwd:"Forgot Password",email:"Email Address",password:"Password",name:"Your Name",choosePwd:"Choose a Password",rememberMe:"Remember Me",login:"Log In",bookSlot:"Book Slot",dashboard:"Dashboard",cancel:"Cancel",viewToken:"View Token",confirmBooking:"Confirm Booking",selectCategory:"Category",selectDate:"Select Date",selectTime:"Select Time",spotsLeft:"spots left",full:"Full",holiday:"Holiday",active:"Active",completed:"Completed",cancelled:"Cancelled",bookingSuccess:"Booking confirmed! 🎉",cancelSuccess:"Booking cancelled",onePerDay:"You already have a booking on this date!",adminLogin:"Admin Login",userLogin:"User Login",allBookings:"All Bookings",slotManager:"Slot Manager",userManager:"User Manager",overview:"Overview" },
  hi: { welcome:"स्वागत है",unit:"4213 यूआरसी एनसीसी ग्रुप, कुर्नूल",tagline:"यहाँ अपना ई-स्लॉट बुक करें",motto:"एकता और अनुशासन",nonMemberNote:"गैर-सदस्य केवल ग्रोसरी बुक कर सकते हैं।",servingNote:"सेवारत कर्मियों से अनुरोध है कि लिकर निकासी के लिए OIC/कैंटीन प्रबंधक से संपर्क करें।",grocery:"किराना",liquor:"शराब",both:"दोनों",myBookings:"मेरी बुकिंग / रद्द",downloadApp:"ऐप डाउनलोड",myProfile:"मेरी प्रोफ़ाइल",liquorNote:"नोट: केवल यूआरसी एनसीसी के पंजीकृत ग्राहक शराब बुक कर सकते हैं",aboutUs:"हमारे बारे में",aboutText:"अध्यक्ष और यूआरसी जीपी मुख्यालय के सभी कर्मचारी वीरों, युद्ध विधवाओं और सेवारत कर्मियों को किराना और शराब दोनों प्रकार की सभी ब्रांड उपलब्ध कराकर अधिकतम संतुष्टि प्रदान करने का प्रयास करते हैं।",signIn:"साइन इन",register:"पंजीकरण",forgotPwd:"पासवर्ड भूल गए",email:"ईमेल पता",password:"पासवर्ड",name:"आपका नाम",choosePwd:"पासवर्ड चुनें",rememberMe:"मुझे याद रखें",login:"लॉग इन",bookSlot:"स्लॉट बुक करें",dashboard:"डैशबोर्ड",cancel:"रद्द करें",viewToken:"टोकन देखें",confirmBooking:"बुकिंग की पुष्टि",selectCategory:"श्रेणी",selectDate:"तारीख चुनें",selectTime:"समय चुनें",spotsLeft:"स्थान शेष",full:"भरा",holiday:"छुट्टी",active:"सक्रिय",completed:"पूर्ण",cancelled:"रद्द",bookingSuccess:"बुकिंग सफल! 🎉",cancelSuccess:"बुकिंग रद्द हुई",onePerDay:"इस तारीख पर पहले से बुकिंग है!",adminLogin:"एडमिन लॉगिन",userLogin:"यूजर लॉगिन",allBookings:"सभी बुकिंग",slotManager:"स्लॉट प्रबंधक",userManager:"यूजर प्रबंधक",overview:"अवलोकन" },
  te: { welcome:"స్వాగతం",unit:"4213 యూఆర్‌సీ ఎన్‌సీసీ గ్రూప్, కర్నూల్",tagline:"ఇక్కడ మీ ఇ-స్లాట్ బుక్ చేయండి",motto:"ఐక్యత మరియు క్రమశిక్షణ",nonMemberNote:"సభ్యులు కాని వారు కేవలం కిరాణా బుక్ చేయవచ్చు.",servingNote:"సేవలో ఉన్న సిబ్బంది మద్యం కోసం OIC/కాంటీన్ మేనేజర్‌ని సంప్రదించాలి.",grocery:"కిరాణా",liquor:"మద్యం",both:"రెండూ",myBookings:"నా బుకింగ్‌లు / రద్దు",downloadApp:"యాప్ డౌన్‌లోడ్",myProfile:"నా ప్రొఫైల్",liquorNote:"గమనిక: ఎన్‌సీసీ నమోదిత సభ్యులు మాత్రమే మద్యం బుక్ చేయవచ్చు",aboutUs:"మా గురించి",aboutText:"చైర్మన్ మరియు యూఆర్‌సీ జీపీ హెడ్‌క్వార్టర్స్ సిబ్బంది వెటరన్లు, యుద్ధ వితంతువులు మరియు సేవలో ఉన్న సిబ్బందికి అన్ని బ్రాండ్లు అందుబాటులో ఉంచి గరిష్ట సంతృప్తి కలిగించడానికి నిరంతరం కృషి చేస్తున్నారు.",signIn:"సైన్ ఇన్",register:"నమోదు",forgotPwd:"పాస్‌వర్డ్ మర్చిపోయారా",email:"ఇమెయిల్",password:"పాస్‌వర్డ్",name:"మీ పేరు",choosePwd:"పాస్‌వర్డ్ ఎంచుకోండి",rememberMe:"నన్ను గుర్తుంచుకో",login:"లాగిన్",bookSlot:"స్లాట్ బుక్",dashboard:"డ్యాష్‌బోర్డ్",cancel:"రద్దు",viewToken:"టోకెన్ చూడు",confirmBooking:"బుకింగ్ నిర్ధారించు",selectCategory:"వర్గం",selectDate:"తేదీ ఎంచుకోండి",selectTime:"సమయం ఎంచుకోండి",spotsLeft:"స్థానాలు",full:"నిండింది",holiday:"సెలవు",active:"సక్రియం",completed:"పూర్తి",cancelled:"రద్దు",bookingSuccess:"బుకింగ్ నిర్ధారించబడింది! 🎉",cancelSuccess:"బుకింగ్ రద్దు చేయబడింది",onePerDay:"ఈ తేదీకి బుకింగ్ ఉంది!",adminLogin:"అడ్మిన్ లాగిన్",userLogin:"యూజర్ లాగిన్",allBookings:"అన్ని బుకింగ్‌లు",slotManager:"స్లాట్ మేనేజర్",userManager:"యూజర్ మేనేజర్",overview:"అవలోకనం" },
  ta: { welcome:"வரவேற்கிறோம்",unit:"4213 யூஆர்சி என்சிசி குழு, கர்நூல்",tagline:"இ-ஸ்லாட் இங்கே பதிவு செய்யுங்கள்",motto:"ஒற்றுமை மற்றும் ஒழுக்கம்",nonMemberNote:"உறுப்பினர் அல்லாதவர்கள் மளிகை மட்டுமே பதிவு செய்யலாம்.",servingNote:"சேவையில் உள்ளவர்கள் மதுபானத்திற்கு OIC ஐ தொடர்பு கொள்ளவும்.",grocery:"மளிகை",liquor:"மதுபானம்",both:"இரண்டும்",myBookings:"என் பதிவுகள் / ரத்து",downloadApp:"ஆப் பதிவிறக்கம்",myProfile:"என் சுயவிவரம்",liquorNote:"குறிப்பு: என்சிசி பதிவு செய்தவர்கள் மட்டுமே மதுபானம் பதிவு செய்யலாம்",aboutUs:"எங்களை பற்றி",aboutText:"தலைவர் மற்றும் யூஆர்சி ஜிபி தலைமையகத்தின் அனைத்து ஊழியர்களும் வீரர்கள், போர் விதவைகள் மற்றும் சேவையில் உள்ளவர்களுக்கு அனைத்து பிராண்டுகளையும் வழங்கி அதிகபட்ச திருப்தி அளிக்க இடைவிடாது முயற்சிக்கின்றனர்.",signIn:"உள்நுழை",register:"பதிவு",forgotPwd:"கடவுச்சொல் மறந்தீர்களா",email:"மின்னஞ்சல்",password:"கடவுச்சொல்",name:"உங்கள் பெயர்",choosePwd:"கடவுச்சொல் தேர்வு",rememberMe:"என்னை நினைவில் வையுங்கள்",login:"உள்நுழைக",bookSlot:"ஸ்லாட் பதிவு",dashboard:"டாஷ்போர்டு",cancel:"ரத்து",viewToken:"டோக்கன் பார்",confirmBooking:"பதிவை உறுதிப்படுத்து",selectCategory:"வகை",selectDate:"தேதி தேர்வு",selectTime:"நேரம் தேர்வு",spotsLeft:"இடங்கள்",full:"நிரம்பியது",holiday:"விடுமுறை",active:"செயல்பாட்டில்",completed:"முடிந்தது",cancelled:"ரத்தானது",bookingSuccess:"பதிவு உறுதிப்படுத்தப்பட்டது! 🎉",cancelSuccess:"பதிவு ரத்தானது",onePerDay:"இந்த தேதியில் ஏற்கனவே பதிவு உள்ளது!",adminLogin:"நிர்வாக உள்நுழைவு",userLogin:"பயனர் உள்நுழைவு",allBookings:"அனைத்து பதிவுகள்",slotManager:"ஸ்லாட் மேலாளர்",userManager:"பயனர் மேலாளர்",overview:"கண்ணோட்டம்" }
};

const generateSlots = () => {
  const slots=[], times=["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"], today=new Date();
  for(let d=0;d<14;d++){
    const date=new Date(today); date.setDate(today.getDate()+d);
    const dateStr=date.toISOString().split("T")[0], isHol=d===3||d===10;
    times.forEach((time,ti)=>{ const cap=20,booked=isHol?cap:Math.floor(Math.random()*14); slots.push({id:`s-${d}-${ti}`,date:dateStr,time,capacity:cap,booked,disabled:isHol,holiday:isHol}); });
  }
  return slots;
};

const USERS=[
  {id:"u1",name:"Ramesh Kumar",email:"admin@urc.in",password:"admin123",role:"admin",status:"active",regiment:"4213 URC NCC"},
  {id:"u2",name:"Suresh Babu",email:"suresh@urc.in",password:"user123",role:"user",status:"active",regiment:"Infantry"},
  {id:"u3",name:"Priya Devi",email:"priya@urc.in",password:"user123",role:"user",status:"active",regiment:"Armoured Corps"},
  {id:"u4",name:"Venkat Rao",email:"venkat@urc.in",password:"user123",role:"user",status:"pending",regiment:"Artillery"},
  {id:"u5",name:"Lakshmi Prasad",email:"lakshmi@urc.in",password:"user123",role:"user",status:"active",regiment:"Signals"},
];
const INIT_B=[
  {id:"TKN-2401",userId:"u2",userName:"Suresh Babu",category:"Grocery + Liquor",date:new Date().toISOString().split("T")[0],time:"09:00 AM",status:"active",slotId:"s-0-0",tokenNo:"TKN-2401"},
  {id:"TKN-2400",userId:"u3",userName:"Priya Devi",category:"Grocery",date:new Date(Date.now()-86400000).toISOString().split("T")[0],time:"10:00 AM",status:"completed",slotId:"s-1-1",tokenNo:"TKN-2400"},
  {id:"TKN-2399",userId:"u5",userName:"Lakshmi Prasad",category:"Liquor Only",date:new Date(Date.now()-172800000).toISOString().split("T")[0],time:"02:00 PM",status:"cancelled",slotId:"s-2-3",tokenNo:"TKN-2399"},
];

const Ctx=createContext(null);
const useApp=()=>useContext(Ctx);

function NccLogo({size=80}){
  return(
    <svg width={size} height={size*1.18} viewBox="0 0 200 236" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e2a8a"/><stop offset="100%" stopColor="#0d1555"/></radialGradient></defs>
      <path d="M12,22 Q12,10 24,10 L176,10 Q188,10 188,22 L188,148 Q188,198 100,226 Q12,198 12,148 Z" fill="#1a237e"/>
      <path d="M12,22 Q12,10 24,10 L80,10 L80,224 Q12,196 12,148 Z" fill="#c62828"/>
      <path d="M120,10 L176,10 Q188,10 188,22 L188,148 Q188,198 120,222 Z" fill="#1565c0"/>
      <circle cx="100" cy="112" r="58" fill="url(#cg)" stroke="#c9a84c" strokeWidth="3.5"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>(
        <ellipse key={i} cx={100+50*Math.cos((a-90)*Math.PI/180)} cy={112+50*Math.sin((a-90)*Math.PI/180)} rx="4.5" ry="8.5" fill="#c9a84c" transform={`rotate(${a},${100+50*Math.cos((a-90)*Math.PI/180)},${112+50*Math.sin((a-90)*Math.PI/180)})`}/>
      ))}
      <text x="100" y="105" textAnchor="middle" fill="#c9a84c" fontSize="24" fontWeight="bold" fontFamily="Georgia,serif">NCC</text>
      <path d="M18,192 Q22,180 34,186 L166,186 Q178,180 182,192 Q178,208 166,202 L34,202 Q22,208 18,192 Z" fill="#111" stroke="#c9a84c" strokeWidth="1.5"/>
      <text x="100" y="198" textAnchor="middle" fill="#c9a84c" fontSize="8.5" fontFamily="Georgia,serif">एकता और अनुशासन</text>
    </svg>
  );
}

function Toast({toasts,remove}){
  return <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:10}}>
    {toasts.map(t=>(
      <div key={t.id} style={{background:t.type==="success"?"#1F3D2B":t.type==="error"?"#dc2626":"#92400e",color:"#fff",padding:"12px 18px",borderRadius:12,minWidth:250,boxShadow:"0 8px 24px rgba(0,0,0,0.22)",display:"flex",alignItems:"center",gap:10,fontSize:14,animation:"toastIn 0.3s ease"}}>
        <span>{t.type==="success"?"✓":t.type==="error"?"✕":"⚠"}</span>
        <span style={{flex:1}}>{t.message}</span>
        <button onClick={()=>remove(t.id)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18}}>×</button>
      </div>
    ))}
  </div>;
}

const LANGS=[
  {code:"en",label:"EN",name:"English"},
  {code:"hi",label:"हि",name:"हिन्दी"},
  {code:"te",label:"తె",name:"తెలుగు"},
  {code:"ta",label:"த",name:"தமிழ்"}
];

function LangBar({lang,setLang,dark,compact=false}){
  if(compact){
    return <div style={{display:"flex",gap:6,alignItems:"center"}}>
      {LANGS.map(l=>{
        const selected = lang===l.code;
        return (
          <button key={l.code} onClick={()=>setLang(l.code)} style={{padding:"6px 10px",borderRadius:12,border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`,background:selected?"#c9a84c":"transparent",color:selected?(dark?"#1a1a1a":"#1a1a1a"): (dark?"rgba(255,255,255,0.75)":"#333"),fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{l.name}</button>
        );
      })}
    </div>;
  }

  return (
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {LANGS.map(l=>{
        const selected = lang===l.code;
        return (
          <button
            key={l.code}
            onClick={()=>setLang(l.code)}
            style={{
              padding: compact?"6px 10px":"8px 12px",
              borderRadius:12,
              border: selected ? "1px solid #c9a84c" : (dark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.08)"),
              background:selected?"#c9a84c":"transparent",
              color:selected?"#1a1a1a":(dark?"rgba(255,255,255,0.85)":"#1a1a1a"),
              fontSize: compact?13:14,
              fontWeight:700,
              cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
              outline:"none"
            }}
          >
            {l.name}
          </button>
        );
      })}
    </div>
  );
}

// HOME
function HomePage({onGoAuth,lang,setLang}){
  const t=T[lang];
  return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:"#f5f6f7"}}>
      {/* Top bar */}
      <div style={{background:"#1F3D2B",color:"#fff",padding:"9px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>📞 Contact OIC for Liquor Drawl with Leave Certificate</span>
        <LangBar lang={lang} setLang={setLang} dark={true} compact={true}/>
      </div>
      {/* Hero */}
      <div style={{background:"linear-gradient(160deg,#0d2016 0%,#1F3D2B 55%,#2d5a3d 100%)",color:"#fff",padding:"64px 20px 90px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:-60,left:-60,width:220,height:220,borderRadius:"50%",background:"rgba(201,168,76,0.05)"}}/>
        <div style={{position:"absolute",bottom:-80,right:-40,width:280,height:280,borderRadius:"50%",background:"rgba(201,168,76,0.04)"}}/>
        <div style={{maxWidth:700,margin:"0 auto",animation:"fadeUp 0.7s ease"}}>
          <div style={{display:"inline-flex",justifyContent:"center",marginBottom:22,filter:"drop-shadow(0 8px 28px rgba(0,0,0,0.45))"}}>
            <NccLogo size={120}/>
          </div>
          <div style={{fontSize:12,letterSpacing:"0.2em",color:"#c9a84c",fontWeight:700,marginBottom:10,textTransform:"uppercase"}}>{t.welcome}</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,5vw,36px)",fontWeight:800,lineHeight:1.2,marginBottom:10}}>{t.unit}</h1>
          <div style={{width:56,height:3,background:"linear-gradient(90deg,#c9a84c,#f0d080)",margin:"14px auto 18px",borderRadius:2}}/>
          <p style={{fontSize:"clamp(15px,3vw,20px)",color:"rgba(255,255,255,0.85)",fontWeight:500,marginBottom:6}}>{t.tagline}</p>
          <p style={{fontSize:13,color:"#c9a84c",letterSpacing:"0.08em"}}>{t.motto}</p>
        </div>
      </div>

      {/* Notice Card */}
      <div style={{maxWidth:800,margin:"-32px auto 0",padding:"0 20px",position:"relative",zIndex:10}}>
        <div style={{background:"#fff",borderRadius:20,padding:"20px 26px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",borderLeft:"5px solid #c9a84c"}}>
          <p style={{fontSize:14,color:"#555",marginBottom:8,lineHeight:1.75,wordBreak:"break-word"}}>⚠️ {t.nonMemberNote}</p>
          <p style={{fontSize:14,color:"#555",lineHeight:1.75,wordBreak:"break-word"}}>📋 {t.servingNote}</p>
        </div>
      </div>

      {/* Quick Book */}
      <div style={{maxWidth:800,margin:"40px auto 0",padding:"0 20px"}}>
        <p style={{textAlign:"center",fontSize:12,fontWeight:700,color:"#1F3D2B",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:22}}>— Quick Book —</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:14,marginBottom:14}}>
          {[{label:t.grocery,icon:"🛒",c:"#1F3D2B"},{label:t.liquor,icon:"🥃",c:"#92400e"},{label:t.both,icon:"🛒🥃",c:"#1e3a5f"}].map(x=>(
            <button key={x.label} onClick={()=>onGoAuth("user")} style={{background:"#fff",border:"2px solid #e5e7eb",borderRadius:18,padding:"22px 14px",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=x.c;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.13)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)"}}>
              <div style={{fontSize:36,marginBottom:10}}>{x.icon}</div>
              <div style={{fontSize:15,fontWeight:800,color:x.c,marginBottom:3}}>{x.label}</div>
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:16}}>
          {[{label:t.myBookings,icon:"🎫"},{label:t.downloadApp,icon:"📱"},{label:t.myProfile,icon:"👤"}].map(x=>(
            <button key={x.label} onClick={()=>onGoAuth("user")} style={{background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:13,padding:"13px 10px",cursor:"pointer",textAlign:"center",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,boxShadow:"0 2px 12px rgba(31,61,43,0.28)",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <span>{x.icon}</span><span>{x.label}</span>
            </button>
          ))}
        </div>
        <div style={{background:"#fef3c7",border:"1.5px solid #f59e0b",borderRadius:12,padding:"11px 18px",textAlign:"center",marginBottom:28}}>
          <p style={{fontSize:13,color:"#92400e",fontWeight:600}}>⭐ {t.liquorNote}</p>
        </div>
        {/* Login Buttons */}
        <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:48}}>
          <button onClick={()=>onGoAuth("user")} style={{flex:1,minWidth:160,background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(31,61,43,0.3)"}}>
            👤 {t.userLogin}
          </button>
          <button onClick={()=>onGoAuth("admin")} style={{flex:1,minWidth:160,background:"linear-gradient(135deg,#7c2d12,#b45309)",border:"none",borderRadius:14,padding:"16px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(124,45,18,0.3)"}}>
            🔐 {t.adminLogin}
          </button>
        </div>
      </div>

      {/* About */}
      <div style={{background:"#1F3D2B",color:"#fff",padding:"56px 20px"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><NccLogo size={60}/></div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,marginBottom:8,color:"#c9a84c"}}>{t.aboutUs}</h2>
          <div style={{width:48,height:2,background:"#c9a84c",margin:"0 auto 22px",borderRadius:1}}/>
          <p style={{fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.82)"}}>{t.aboutText}</p>
        </div>
      </div>
      <div style={{background:"#0d2016",color:"rgba(255,255,255,0.35)",textAlign:"center",padding:"18px",fontSize:12}}>
        © 2024 4213 URC NCC Group, Kurnool · All rights reserved
      </div>
    </div>
  );
}

// AUTH
function AuthScreen({mode,onLogin,onBack,lang,setLang,users,setUsers}){
  const t=T[lang], isAdmin=mode==="admin";
  const [tab,setTab]=useState("signin");
  const [email,setEmail]=useState(""), [pwd,setPwd]=useState(""), [err,setErr]=useState(""), [loading,setLoading]=useState(false);
  const [rName,setRName]=useState(""), [rEmail,setREmail]=useState(""), [rPwd,setRPwd]=useState(""), [rRegiment,setRRegiment]=useState("");

  // Clear error when switching tabs or when users list updates
  useEffect(()=>{ setErr(""); },[tab]);
  useEffect(()=>{ setEmail(""); setPwd(""); setErr(""); },[]);

  const doLogin=()=>{
    const trimEmail=email.trim().toLowerCase();
    const trimPwd=pwd.trim();
    if(!trimEmail||!trimPwd){setErr("Please enter email and password.");return;}
    setErr(""); setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      const u=users.find(x=>x.email.trim().toLowerCase()===trimEmail&&x.password===trimPwd);
      if(!u){setErr("Invalid email or password.");return;}
      if(isAdmin&&u.role!=="admin"){setErr("Not authorized as admin.");return;}
      if(!isAdmin&&u.role==="admin"){setErr("Please use Admin Login for admin accounts.");return;}
      if(u.status==="pending"){setErr("Account pending admin approval.");return;}
      if(u.status==="disabled"){setErr("Account disabled. Contact administrator.");return;}
      onLogin(u);
    },600);
  };

  const doRegister=()=>{
    setErr("");
    if(!rName||!rEmail||!rPwd||!rRegiment){setErr("All fields are required.");return;}
    if(users.find(u=>u.email===rEmail)){setErr("Email already registered.");return;}
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setUsers(u=>[...u,{id:`u${Date.now()}`,name:rName,email:rEmail,password:rPwd,role:"user",status:"pending",regiment:rRegiment}]);
      setTab("signin"); setEmail(rEmail); setErr("");
    },800);
  };

  return(
    <div style={{minHeight:"100vh",background:isAdmin?"linear-gradient(135deg,#1a0800 0%,#3b1500 45%,#6b2d00 100%)":"linear-gradient(160deg,#0d2016 0%,#1F3D2B 55%,#2d5a3d 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"7px 16px",color:"#fff",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>← Home</button>
          <LangBar lang={lang} setLang={setLang} dark={true} compact={true}/>
        </div>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",justifyContent:"center",marginBottom:14,filter:"drop-shadow(0 6px 20px rgba(0,0,0,0.4))"}}><NccLogo size={80}/></div>
          <h1 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:21,marginBottom:4}}>{isAdmin?t.adminLogin:t.userLogin}</h1>
          <p style={{color:isAdmin?"#fb923c":"#c9a84c",fontSize:12}}>{t.unit}</p>
        </div>
        <div style={{background:"#fff",borderRadius:24,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.38)"}}>
          {!isAdmin&&(
            <div style={{display:"flex",borderBottom:"1px solid #e5e7eb"}}>
              {[{id:"signin",label:t.signIn,icon:"🔒"},{id:"register",label:t.register,icon:"✏️"},{id:"forgot",label:t.forgotPwd,icon:"🔑"}].map(tb=>(
                <button key={tb.id} onClick={()=>{setTab(tb.id);setErr("");}} style={{flex:1,padding:"13px 4px",border:"none",background:tab===tb.id?"#fff":"#f9fafb",borderBottom:tab===tb.id?"3px solid #1F3D2B":"3px solid transparent",color:tab===tb.id?"#1F3D2B":"#999",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                  <span>{tb.icon}</span><span>{tb.label}</span>
                </button>
              ))}
            </div>
          )}
          <div style={{padding:30}}>
            {isAdmin&&<div style={{textAlign:"center",marginBottom:18,fontSize:12,background:"#fff7ed",border:"1.5px solid #fed7aa",borderRadius:10,padding:"9px 14px",color:"#92400e",fontWeight:600}}>🔐 Restricted Access — Admin Only</div>}
            {(tab==="signin"||isAdmin)&&(
              <>
                {isAdmin&&<h2 style={{fontSize:20,fontWeight:800,color:"#1a1a1a",marginBottom:22}}>{t.adminLogin}</h2>}
                {[{label:t.email,val:email,set:setEmail,type:"email",ph:"Enter email"},{label:t.password,val:pwd,set:setPwd,type:"password",ph:"••••••••"}].map(f=>(
                  <div key={f.label} style={{marginBottom:16}}>
                    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:6}}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{width:"100%",padding:"13px 15px",border:"2px solid #e5e7eb",borderRadius:12,fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif",color:"#1a1a1a",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#1F3D2B"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
                  </div>
                ))}
                {!isAdmin&&<label style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,cursor:"pointer"}}><input type="checkbox" style={{width:15,height:15}}/><span style={{fontSize:13,color:"#555"}}>{t.rememberMe}</span></label>}
                {err&&<div style={{background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:10,padding:"9px 14px",color:"#dc2626",fontSize:13,marginBottom:14}}>{err}</div>}
                <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"14px",background:isAdmin?"linear-gradient(135deg,#92400e,#b45309)":"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  {loading?"Verifying…":t.login}
                </button>
                <p style={{textAlign:"center",fontSize:11,color:"#aaa",marginTop:14}}>{isAdmin?"Demo: admin@urc.in / admin123":"Demo: suresh@urc.in / user123"}</p>
              </>
            )}
            {tab==="register"&&!isAdmin&&(
              <>
                <h2 style={{fontSize:20,fontWeight:800,color:"#1a1a1a",marginBottom:20}}>{t.register}</h2>
                {[{label:t.name,val:rName,set:setRName,type:"text",ph:"Full Name"},{label:t.email,val:rEmail,set:setREmail,type:"email",ph:"Email"},{label:t.choosePwd,val:rPwd,set:setRPwd,type:"password",ph:"Password"}].map(f=>(
                  <div key={f.label} style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:6}}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",padding:"13px 15px",border:"2px solid #e5e7eb",borderRadius:12,fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif",color:"#1a1a1a",boxSizing:"border-box"}}/>
                  </div>
                ))}
                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:6}}>Regiment / Unit</label>
                  <select value={rRegiment} onChange={e=>setRRegiment(e.target.value)} style={{width:"100%",padding:"13px 15px",border:`2px solid ${!rRegiment&&err?"#fecaca":"#e5e7eb"}`,borderRadius:12,fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif",color:rRegiment?"#1a1a1a":"#999",background:"#fff",boxSizing:"border-box",cursor:"pointer"}}>
                    <option value="">— Select your Regiment —</option>
                    <option value="Infantry">Infantry</option>
                    <option value="Armoured Corps">Armoured Corps</option>
                    <option value="Artillery">Artillery</option>
                    <option value="Signals">Signals</option>
                    <option value="Engineers">Engineers</option>
                    <option value="Army Service Corps">Army Service Corps</option>
                    <option value="Army Medical Corps">Army Medical Corps</option>
                    <option value="Ordnance Corps">Ordnance Corps</option>
                    <option value="Electrical & Mechanical Engineers">Electrical & Mechanical Engineers</option>
                    <option value="Intelligence Corps">Intelligence Corps</option>
                    <option value="4213 URC NCC">4213 URC NCC Staff</option>
                    <option value="Veteran">Veteran</option>
                    <option value="War Widow">War Widow</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {err&&<div style={{background:"#fef2f2",border:"1.5px solid #fecaca",borderRadius:10,padding:"9px 14px",color:"#dc2626",fontSize:13,marginBottom:14}}>{err}</div>}
                <button onClick={doRegister} disabled={loading} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{loading?"Registering…":t.register}</button>
                <p style={{textAlign:"center",fontSize:11,color:"#999",marginTop:12}}>Account requires admin approval before activation.</p>
              </>
            )}
            {tab==="forgot"&&!isAdmin&&(
              <>
                <h2 style={{fontSize:20,fontWeight:800,color:"#1a1a1a",marginBottom:10}}>{t.forgotPwd}</h2>
                <p style={{fontSize:14,color:"#666",marginBottom:22,lineHeight:1.6}}>Enter your email to receive a reset link.</p>
                <div style={{marginBottom:18}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:6}}>{t.email}</label>
                  <input type="email" placeholder="Email" style={{width:"100%",padding:"13px 15px",border:"2px solid #e5e7eb",borderRadius:12,fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif",color:"#1a1a1a",boxSizing:"border-box"}}/>
                </div>
                <button style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Send Reset Link</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const L={bg:"#f5f6f7",card:"#ffffff",text:"#1a1a1a",muted:"#6b7280",border:"#e5e7eb",shadow:"0 2px 12px rgba(0,0,0,0.06)"};
const D={bg:"#0d1117",card:"#161b22",text:"#f0f6fc",muted:"#8b949e",border:"#30363d",shadow:"0 2px 12px rgba(0,0,0,0.4)"};

function UserSidebar({active,onNav,user,onLogout,dark,lang,setLang}){
  const t=T[lang];
  const items=[{id:"dashboard",label:t.dashboard,icon:"⊞"},{id:"book",label:t.bookSlot,icon:"📅"},{id:"bookings",label:"My Bookings",icon:"🎫"},{id:"profile",label:t.myProfile,icon:"👤"}];
  const s=dark?D:L;
  return(
    <div style={{width:230,minHeight:"100vh",background:dark?"#0d1a12":"#1F3D2B",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflowY:"auto"}}>
      <div style={{padding:"20px 18px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><NccLogo size={34}/><div><div style={{color:"#fff",fontWeight:700,fontSize:11,lineHeight:1.2}}>4213 URC NCC</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:9}}>Kurnool</div></div></div>
      </div>
      <nav style={{flex:1,padding:"12px 9px"}}>
        {items.map(item=>(
          <button key={item.id} onClick={()=>onNav(item.id)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:"11px 12px",background:active===item.id?"rgba(255,255,255,0.12)":"none",border:"none",borderRadius:10,color:active===item.id?"#fff":"rgba(255,255,255,0.58)",cursor:"pointer",fontSize:13,fontWeight:active===item.id?600:400,marginBottom:2,textAlign:"left",fontFamily:"'DM Sans',sans-serif",borderLeft:active===item.id?"3px solid #c9a84c":"3px solid transparent"}}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{padding:"12px 9px 16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{marginBottom:8}}>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:10,fontWeight:700,letterSpacing:"0.08em",marginBottom:6,paddingLeft:4}}>LANGUAGE</p>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <LangBar lang={lang} setLang={setLang} dark={true} compact={true} />
          </div>
        </div>
        <div style={{padding:"10px 11px",background:"rgba(255,255,255,0.06)",borderRadius:10,marginBottom:7}}>
          <div style={{color:"#fff",fontWeight:600,fontSize:12}}>{user?.name}</div>
          <div style={{color:"rgba(255,255,255,0.42)",fontSize:10,marginTop:1}}>{user?.regiment}</div>
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"9px",background:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>Sign Out</button>
      </div>
    </div>
  );
}

function AdminSidebar({active,onNav,user,onLogout,dark}){
  const items=[{id:"admin-dashboard",label:"Overview",icon:"📊"},{id:"admin-slots",label:"Slot Manager",icon:"⚙️"},{id:"admin-bookings",label:"All Bookings",icon:"📋"},{id:"admin-users",label:"User Manager",icon:"👥"}];
  return(
    <div style={{width:230,minHeight:"100vh",background:dark?"#1a0a00":"#2c1000",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,bottom:0,zIndex:100,overflowY:"auto"}}>
      <div style={{padding:"20px 18px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><NccLogo size={34}/><div><div style={{color:"#fff",fontWeight:700,fontSize:11}}>Admin Panel</div><div style={{color:"rgba(249,115,22,0.7)",fontSize:9}}>4213 URC NCC</div></div></div>
        <div style={{background:"rgba(249,115,22,0.18)",border:"1px solid rgba(249,115,22,0.35)",borderRadius:6,padding:"3px 9px",display:"inline-block"}}><span style={{fontSize:9,color:"#fb923c",fontWeight:700}}>🔐 ADMIN ACCESS</span></div>
      </div>
      <nav style={{flex:1,padding:"12px 9px"}}>
        {items.map(item=>(
          <button key={item.id} onClick={()=>onNav(item.id)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:"11px 12px",background:active===item.id?"rgba(249,115,22,0.14)":"none",border:"none",borderRadius:10,color:active===item.id?"#fff":"rgba(255,255,255,0.58)",cursor:"pointer",fontSize:13,fontWeight:active===item.id?600:400,marginBottom:2,textAlign:"left",fontFamily:"'DM Sans',sans-serif",borderLeft:active===item.id?"3px solid #f97316":"3px solid transparent"}}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{padding:"12px 9px 16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{padding:"10px 11px",background:"rgba(255,255,255,0.06)",borderRadius:10,marginBottom:7}}>
          <div style={{color:"#fff",fontWeight:600,fontSize:12}}>{user?.name}</div>
          <div style={{color:"#f97316",fontSize:9,fontWeight:700,marginTop:1}}>ADMINISTRATOR</div>
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"9px",background:"rgba(255,255,255,0.06)",border:"none",borderRadius:10,color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>Sign Out</button>
      </div>
    </div>
  );
}

// USER PAGES
function UserDashboard({onNav,lang}){
  const{currentUser,bookings,slots}=useApp(), t=T[lang];
  const my=bookings.filter(b=>b.userId===currentUser.id), up=my.filter(b=>b.status==="active")[0];
  const today=new Date().toISOString().split("T")[0], avail=slots.filter(s=>s.date===today&&!s.disabled&&s.booked<s.capacity).length;
  return(
    <div>
      <h1 style={{fontSize:25,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>Welcome, {currentUser.name.split(" ")[0]} 👋</h1>
      <p style={{color:"var(--muted)",margin:"0 0 26px",fontSize:14}}>4213 URC NCC Group, Kurnool</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:13,marginBottom:24}}>
        {[{l:"Total Bookings",v:my.length,i:"🎫",c:"#1F3D2B"},{l:"Active Tokens",v:my.filter(b=>b.status==="active").length,i:"✅",c:"#065f46"},{l:"Available Today",v:avail,i:"🕐",c:"#92400e"}].map(s=>(
          <div key={s.l} style={{background:"var(--card)",borderRadius:15,padding:"19px 17px",boxShadow:"var(--shadow)"}}>
            <div style={{fontSize:24,marginBottom:7}}>{s.i}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      {up?(
        <div style={{background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",borderRadius:18,padding:24,marginBottom:20,color:"#fff"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:"#c9a84c",marginBottom:7,textTransform:"uppercase"}}>Upcoming Booking</div>
          <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>{up.category}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginBottom:3}}>📅 {up.date} · ⏰ {up.time}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.48)",marginBottom:13}}>Token: {up.tokenNo}</div>
          <button onClick={()=>onNav("bookings")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:9,padding:"8px 16px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>View Token →</button>
        </div>
      ):(
        <div style={{background:"var(--card)",borderRadius:18,padding:24,marginBottom:20,textAlign:"center",boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:42,marginBottom:9}}>📅</div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:4}}>No upcoming bookings</div>
          <div style={{color:"var(--muted)",fontSize:13,marginBottom:16}}>Book a slot to visit the canteen</div>
          <button onClick={()=>onNav("book")} style={{background:"#1F3D2B",color:"#fff",border:"none",borderRadius:11,padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.bookSlot}</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <button onClick={()=>onNav("book")} style={{background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:15,padding:"19px 15px",color:"#fff",cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{fontSize:24,marginBottom:7}}>📅</div>
          <div style={{fontSize:14,fontWeight:700}}>{t.bookSlot}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.58)",marginTop:2}}>Grocery, Liquor or Both</div>
        </button>
        <button onClick={()=>onNav("bookings")} style={{background:"var(--card)",border:"2px solid var(--border)",borderRadius:15,padding:"19px 15px",cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",boxShadow:"var(--shadow)"}}>
          <div style={{fontSize:24,marginBottom:7}}>🎫</div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>My Bookings</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>View all tokens</div>
        </button>
      </div>
    </div>
  );
}

function BookSlot({lang}){
  const{currentUser,slots,addBooking,bookings,showToast}=useApp(), t=T[lang];
  const[step,setStep]=useState(1), [cat,setCat]=useState(""), [selDate,setSelDate]=useState(""), [selSlot,setSelSlot]=useState(null);
  const today=new Date();
  const dates=Array.from({length:14},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()+i);return d.toISOString().split("T")[0];});
  const dateSlots=selDate?slots.filter(s=>s.date===selDate):[];
  const alreadyBooked=selDate&&bookings.some(b=>b.userId===currentUser.id&&b.date===selDate&&b.status==="active");

  const confirm=()=>{
    if(alreadyBooked){showToast(t.onePerDay,"error");return;}
    const tok=`TKN-${2410+bookings.length}`;
    addBooking({id:tok,userId:currentUser.id,userName:currentUser.name,category:cat,date:selDate,time:selSlot.time,status:"active",slotId:selSlot.id,tokenNo:tok},selSlot.id);
    showToast(t.bookingSuccess,"success"); setStep(5);
  };

  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>{t.bookSlot}</h1>
      <p style={{color:"var(--muted)",margin:"0 0 22px",fontSize:13}}>Reserve your canteen slot in a few steps</p>
      {step<5&&(
        <div style={{display:"flex",background:"var(--card)",borderRadius:11,padding:4,marginBottom:24,boxShadow:"var(--shadow)"}}>
          {[t.selectCategory,t.selectDate,t.selectTime,t.confirmBooking].map((l,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",padding:"7px 3px",borderRadius:8,background:step===i+1?"#1F3D2B":"none",color:step===i+1?"#fff":step>i+1?"#1F3D2B":"var(--muted)",fontSize:10,fontWeight:step===i+1?700:400}}>
              {step>i+1?"✓ ":""}{l}
            </div>
          ))}
        </div>
      )}

      {step===1&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:13}}>
          {[{id:"Grocery",icon:"🛒",desc:"Open to all"},{id:"Liquor Only",icon:"🥃",desc:"Registered members"},{id:"Grocery + Liquor",icon:"🛒🥃",desc:"Combined"}].map(c=>(
            <button key={c.id} onClick={()=>{setCat(c.id);setStep(2);}} style={{background:"var(--card)",border:"2px solid var(--border)",borderRadius:16,padding:"22px 16px",cursor:"pointer",textAlign:"left",boxShadow:"var(--shadow)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#1F3D2B";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{fontSize:32,marginBottom:11}}>{c.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:3}}>{c.id}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>{c.desc}</div>
              <div style={{color:"#1F3D2B",fontWeight:600,fontSize:12}}>Select →</div>
            </button>
          ))}
        </div>
      )}

      {step===2&&(
        <div>
          <h2 style={{fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:16}}>{t.selectDate}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))",gap:9}}>
            {dates.map(d=>{
              const ds=slots.filter(s=>s.date===d), isHol=ds.every(s=>s.disabled), isFull=!isHol&&ds.every(s=>s.booked>=s.capacity);
              const av=ds.filter(s=>!s.disabled&&s.booked<s.capacity).length, date=new Date(d), isSel=selDate===d, dis=isHol||isFull;
              return(
                <button key={d} onClick={()=>{if(!dis){setSelDate(d);setStep(3);}}} disabled={dis} style={{background:isSel?"#1F3D2B":"var(--card)",border:`2px solid ${isSel?"#1F3D2B":"var(--border)"}`,borderRadius:13,padding:"11px 7px",cursor:dis?"not-allowed":"pointer",textAlign:"center",opacity:dis?0.4:1,boxShadow:"var(--shadow)",fontFamily:"'DM Sans',sans-serif"}}>
                  <div style={{fontSize:9,color:isSel?"rgba(255,255,255,0.65)":"var(--muted)",fontWeight:600}}>{date.toLocaleDateString("en-IN",{weekday:"short"})}</div>
                  <div style={{fontSize:20,fontWeight:800,color:isSel?"#fff":"var(--text)",margin:"2px 0"}}>{date.getDate()}</div>
                  <div style={{fontSize:9,color:isSel?"rgba(255,255,255,0.65)":"var(--muted)"}}>{date.toLocaleDateString("en-IN",{month:"short"})}</div>
                  {isHol&&<div style={{fontSize:8,color:"#ef4444",marginTop:2,fontWeight:700}}>{t.holiday}</div>}
                  {isFull&&!isHol&&<div style={{fontSize:8,color:"#ef4444",marginTop:2,fontWeight:700}}>{t.full}</div>}
                  {!dis&&<div style={{fontSize:8,color:isSel?"#c9a84c":"#1F3D2B",marginTop:2,fontWeight:700}}>{av} slots</div>}
                </button>
              );
            })}
          </div>
          <button onClick={()=>setStep(1)} style={{marginTop:16,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        </div>
      )}

      {step===3&&(
        <div>
          <h2 style={{fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:5}}>{t.selectTime}</h2>
          <p style={{color:"var(--muted)",fontSize:12,marginBottom:16}}>{selDate} — {cat}</p>
          {alreadyBooked&&<div style={{background:"#fef3c7",border:"2px solid #f59e0b",borderRadius:11,padding:"10px 14px",marginBottom:16,color:"#92400e",fontSize:13,fontWeight:500}}>⚠️ {t.onePerDay}</div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:11}}>
            {dateSlots.map(slot=>{
              const rem=slot.capacity-slot.booked, pct=(slot.booked/slot.capacity)*100, isFull=rem<=0;
              return(
                <button key={slot.id} onClick={()=>{if(!isFull&&!slot.disabled){setSelSlot(slot);setStep(4);}}} disabled={isFull||slot.disabled} style={{background:"var(--card)",border:`2px solid ${isFull?"#fecaca":"var(--border)"}`,borderRadius:15,padding:"17px 15px",cursor:isFull?"not-allowed":"pointer",opacity:isFull?0.5:1,textAlign:"left",boxShadow:"var(--shadow)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}
                  onMouseEnter={e=>{if(!isFull){e.currentTarget.style.borderColor="#1F3D2B";e.currentTarget.style.transform="translateY(-2px)";}}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=isFull?"#fecaca":"var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
                  <div style={{fontSize:16,fontWeight:800,color:"var(--text)",marginBottom:7}}>{slot.time}</div>
                  <div style={{height:4,background:"#e5e7eb",borderRadius:3,marginBottom:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct>80?"#ef4444":pct>50?"#f59e0b":"#22c55e",borderRadius:3}}/>
                  </div>
                  <div style={{fontSize:12,color:isFull?"#ef4444":"#16a34a",fontWeight:600}}>{isFull?t.full:`${rem} ${t.spotsLeft}`}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{slot.booked}/{slot.capacity} booked</div>
                </button>
              );
            })}
          </div>
          <button onClick={()=>setStep(2)} style={{marginTop:16,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        </div>
      )}

      {step===4&&selSlot&&(
        <div style={{maxWidth:420}}>
          <h2 style={{fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:16}}>{t.confirmBooking}</h2>
          <div style={{background:"var(--card)",borderRadius:16,padding:22,boxShadow:"var(--shadow)",marginBottom:16}}>
            {[["Name",currentUser.name],["Category",cat],["Date",selDate],["Time",selSlot.time],["Spots Available",`${selSlot.capacity-selSlot.booked}`]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:13,color:"var(--muted)"}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={confirm} style={{width:"100%",background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",border:"none",borderRadius:12,padding:"14px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:9}}>✓ {t.confirmBooking}</button>
          <button onClick={()=>setStep(3)} style={{width:"100%",background:"none",border:"2px solid var(--border)",borderRadius:12,padding:"12px",color:"var(--muted)",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        </div>
      )}

      {step===5&&(
        <div style={{textAlign:"center",maxWidth:380,margin:"0 auto"}}>
          <div style={{width:68,height:68,background:"#dcfce7",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 16px"}}>✓</div>
          <h2 style={{fontSize:21,fontWeight:800,color:"var(--text)",marginBottom:7}}>Booking Confirmed!</h2>
          <p style={{color:"var(--muted)",fontSize:13,marginBottom:22}}>View your token in My Bookings</p>
          <button onClick={()=>setStep(1)} style={{background:"#1F3D2B",border:"none",borderRadius:11,padding:"12px 26px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Book Another</button>
        </div>
      )}
    </div>
  );
}

function MyBookings({lang}){
  const{currentUser,bookings,cancelBooking,showToast}=useApp(), t=T[lang];
  const[filter,setFilter]=useState("all"), [tv,setTv]=useState(null);
  const my=bookings.filter(b=>b.userId===currentUser.id);
  const fil=filter==="all"?my:my.filter(b=>b.status===filter);
  const sc={active:{bg:"#dcfce7",tx:"#166534"},completed:{bg:"#dbeafe",tx:"#1e40af"},cancelled:{bg:"#fee2e2",tx:"#991b1b"}};
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>My Bookings</h1>
      <p style={{color:"var(--muted)",margin:"0 0 20px",fontSize:13}}>Your canteen slot history</p>
      <div style={{display:"flex",gap:7,marginBottom:20,flexWrap:"wrap"}}>
        {["all","active","completed","cancelled"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 15px",borderRadius:20,border:"2px solid",borderColor:filter===f?"#1F3D2B":"var(--border)",background:filter===f?"#1F3D2B":"var(--card)",color:filter===f?"#fff":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
      {fil.length===0?(
        <div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:42,marginBottom:9}}>🎫</div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:3}}>No bookings found</div>
          <div style={{color:"var(--muted)",fontSize:13}}>Bookings appear here once created</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {fil.map(b=>(
            <div key={b.id} style={{background:"var(--card)",borderRadius:15,padding:"17px 20px",boxShadow:"var(--shadow)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:170}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{b.category}</span>
                  <span style={{background:sc[b.status].bg,color:sc[b.status].tx,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,textTransform:"uppercase"}}>{b.status}</span>
                </div>
                <div style={{fontSize:12,color:"var(--muted)"}}>📅 {b.date} · ⏰ {b.time}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Token: {b.tokenNo}</div>
              </div>
              {b.status==="active"&&(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setTv(b)} style={{background:"#1F3D2B",border:"none",borderRadius:9,padding:"8px 15px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{t.viewToken}</button>
                  <button onClick={()=>{cancelBooking(b.id,b.slotId);showToast(t.cancelSuccess,"warning");}} style={{background:"none",border:"2px solid #fecaca",borderRadius:9,padding:"8px 15px",color:"#ef4444",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{t.cancel}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tv&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={()=>setTv(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,padding:28,maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 32px 64px rgba(0,0,0,0.32)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><NccLogo size={26}/><span style={{fontSize:11,fontWeight:700,color:"#1F3D2B"}}>URC KURNOOL</span></div>
              <button onClick={()=>setTv(null)} style={{background:"#f5f5f5",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:15}}>×</button>
            </div>
            <div style={{background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",borderRadius:16,padding:"26px 22px",color:"#fff",marginBottom:14}}>
              <div style={{fontSize:9,color:"#c9a84c",fontWeight:700,letterSpacing:"0.1em",marginBottom:5}}>ENTRY TOKEN</div>
              <div style={{fontSize:30,fontWeight:900,letterSpacing:"0.04em",marginBottom:5}}>{tv.tokenNo}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginBottom:13}}>{tv.category}</div>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:9,padding:"9px 11px",display:"flex",justifyContent:"space-between"}}>
                <div style={{textAlign:"left"}}><div style={{fontSize:8,color:"rgba(255,255,255,0.45)",marginBottom:2}}>DATE</div><div style={{fontSize:11,fontWeight:700}}>{tv.date}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:8,color:"rgba(255,255,255,0.45)",marginBottom:2}}>TIME</div><div style={{fontSize:11,fontWeight:700}}>{tv.time}</div></div>
              </div>
            </div>
            <div style={{background:"#f9fafb",borderRadius:11,padding:14,marginBottom:11}}>
              <div style={{width:76,height:76,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
                {Array.from({length:49},(_,i)=><div key={i} style={{background:Math.sin(i*3.7+1)>0?"#1F3D2B":"transparent",borderRadius:1}}/>)}
              </div>
            </div>
            <div style={{fontSize:11,color:"#999",marginBottom:6}}>Show at gate · {currentUser?.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfile(){
  const{currentUser}=useApp();
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 22px",color:"var(--text)"}}>My Profile</h1>
      <div style={{background:"var(--card)",borderRadius:18,padding:26,boxShadow:"var(--shadow)",maxWidth:440}}>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:22,paddingBottom:22,borderBottom:"1px solid var(--border)"}}>
          <div style={{width:60,height:60,background:"linear-gradient(135deg,#1F3D2B,#2d5a3d)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"#fff"}}>👤</div>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"var(--text)"}}>{currentUser.name}</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>{currentUser.email}</div>
            <span style={{fontSize:10,background:"#dcfce7",color:"#166534",padding:"2px 8px",borderRadius:20,fontWeight:700,display:"inline-block",marginTop:4}}>ACTIVE</span>
          </div>
        </div>
        {[["Regiment",currentUser.regiment],["Role",currentUser.role],["Member ID",currentUser.id]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:13,color:"var(--muted)"}}>{k}</span>
            <span style={{fontSize:13,fontWeight:600,color:"var(--text)",textTransform:"capitalize"}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ADMIN PAGES
function AdminDashboard(){
  const{bookings,slots,users}=useApp();
  const today=new Date().toISOString().split("T")[0];
  const tb=bookings.filter(b=>b.date===today);
  const tc=slots.filter(s=>s.date===today).reduce((a,s)=>a+s.capacity,0);
  const tb2=slots.filter(s=>s.date===today).reduce((a,s)=>a+s.booked,0);
  const fp=tc?Math.round((tb2/tc)*100):0;
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>Admin Overview</h1>
      <p style={{color:"var(--muted)",margin:"0 0 24px",fontSize:13}}>Real-time system metrics for 4213 URC NCC</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:13,marginBottom:24}}>
        {[{l:"Today's Bookings",v:tb.length,i:"📅",c:"#1F3D2B"},{l:"Total Users",v:users.length,i:"👥",c:"#1e40af"},{l:"Pending Approval",v:users.filter(u=>u.status==="pending").length,i:"⏳",c:"#92400e"},{l:"Active Tokens",v:bookings.filter(b=>b.status==="active").length,i:"✅",c:"#065f46"}].map(s=>(
          <div key={s.l} style={{background:"var(--card)",borderRadius:14,padding:"19px 17px",boxShadow:"var(--shadow)"}}>
            <div style={{fontSize:24,marginBottom:7}}>{s.i}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--card)",borderRadius:14,padding:20,marginBottom:18,boxShadow:"var(--shadow)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
          <span style={{fontWeight:600,color:"var(--text)",fontSize:13}}>Today's Slot Fill Rate</span>
          <span style={{fontWeight:700,color:"var(--text)",fontSize:13}}>{tb2}/{tc}</span>
        </div>
        <div style={{height:9,background:"#e5e7eb",borderRadius:7,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${fp}%`,background:fp>80?"#ef4444":fp>50?"#f59e0b":"#22c55e",borderRadius:7,transition:"width 0.5s"}}/>
        </div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:5}}>{fp}% filled</div>
      </div>
      <div style={{background:"var(--card)",borderRadius:14,padding:20,boxShadow:"var(--shadow)"}}>
        <h3 style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:16}}>Bookings by Category</h3>
        {["Grocery","Liquor Only","Grocery + Liquor"].map((c,i)=>{
          const cnt=bookings.filter(b=>b.category===c).length, pct=bookings.length?Math.round((cnt/bookings.length)*100):0;
          return(
            <div key={c} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:"var(--text)"}}>{c}</span>
                <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{cnt}</span>
              </div>
              <div style={{height:6,background:"#e5e7eb",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:["#1F3D2B","#c9a84c","#1e40af"][i],borderRadius:4}}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminSlots(){
  const{slots,updateSlot,showToast}=useApp();
  const[selDate,setSelDate]=useState(new Date().toISOString().split("T")[0]);
  const[editSlot,setEditSlot]=useState(null), [newCap,setNewCap]=useState("");
  const uDates=[...new Set(slots.map(s=>s.date))].slice(0,14);
  const dSlots=slots.filter(s=>s.date===selDate);
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>Slot Manager</h1>
      <p style={{color:"var(--muted)",margin:"0 0 20px",fontSize:13}}>Control capacity and availability per date</p>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:20}}>
        {uDates.map(d=>(
          <button key={d} onClick={()=>setSelDate(d)} style={{padding:"6px 13px",borderRadius:18,border:"2px solid",borderColor:selDate===d?"#1F3D2B":"var(--border)",background:selDate===d?"#1F3D2B":"var(--card)",color:selDate===d?"#fff":"var(--text)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            {new Date(d).toLocaleDateString("en-IN",{month:"short",day:"numeric"})}
          </button>
        ))}
      </div>
      <div style={{background:"var(--card)",borderRadius:14,overflow:"auto",boxShadow:"var(--shadow)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
          <thead>
            <tr style={{background:"#f9fafb",borderBottom:"1px solid var(--border)"}}>
              {["Time","Capacity","Booked","Available","Fill","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"12px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dSlots.map((s,i)=>{
              const rem=s.capacity-s.booked, pct=Math.round((s.booked/s.capacity)*100);
              return(
                <tr key={s.id} style={{borderBottom:i<dSlots.length-1?"1px solid var(--border)":"none"}}>
                  <td style={{padding:"12px 13px",fontWeight:600,color:"var(--text)",fontSize:13}}>{s.time}</td>
                  <td style={{padding:"12px 13px",color:"var(--text)",fontSize:12}}>{s.capacity}</td>
                  <td style={{padding:"12px 13px",color:"var(--text)",fontSize:12}}>{s.booked}</td>
                  <td style={{padding:"12px 13px",color:rem>0?"#16a34a":"#ef4444",fontWeight:600,fontSize:12}}>{rem}</td>
                  <td style={{padding:"12px 13px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:55,height:5,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:pct>80?"#ef4444":pct>50?"#f59e0b":"#22c55e",borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:11,color:"var(--muted)"}}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 13px"}}>
                    <span style={{background:s.disabled?"#fee2e2":"#dcfce7",color:s.disabled?"#991b1b":"#166534",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:18}}>{s.disabled?"Disabled":"Active"}</span>
                  </td>
                  <td style={{padding:"12px 13px"}}>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>{setEditSlot(s);setNewCap(s.capacity);}} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"5px 10px",color:"#166534",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Edit</button>
                      <button onClick={()=>{updateSlot(s.id,{disabled:!s.disabled});showToast(s.disabled?"Slot enabled":"Slot disabled","success");}} style={{background:s.disabled?"#f0fdf4":"#fef2f2",border: s.disabled? "1px solid #bbf7d0" : "1px solid #fecaca",borderRadius:7,padding:"5px 10px",color:s.disabled?"#166534":"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{s.disabled?"Enable":"Disable"}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editSlot&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}} onClick={()=>setEditSlot(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"var(--card)",borderRadius:18,padding:26,maxWidth:320,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.25)"}}>
            <h3 style={{margin:"0 0 16px",color:"var(--text)",fontSize:16}}>Edit Slot — {editSlot.time}</h3>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"#444",marginBottom:6,textTransform:"uppercase"}}>New Capacity</label>
            <input type="number" value={newCap} onChange={e=>setNewCap(e.target.value)} style={{width:"100%",padding:"11px 13px",border:"2px solid var(--border)",borderRadius:10,fontSize:15,outline:"none",color:"var(--text)",background:"var(--bg)",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",marginBottom:16}}/>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>{updateSlot(editSlot.id,{capacity:parseInt(newCap)||editSlot.capacity});setEditSlot(null);showToast("Slot updated!","success");}} style={{flex:1,background:"#1F3D2B",border:"none",borderRadius:9,padding:"11px",color:"#fff",cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Save</button>
              <button onClick={()=>setEditSlot(null)} style={{flex:1,background:"none",border:"2px solid var(--border)",borderRadius:9,padding:"11px",color:"var(--muted)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminBookings(){
  const{bookings,cancelBooking,showToast}=useApp();
  const[sf,setSf]=useState("all"), [cf,setCf]=useState("all");
  let fil=sf==="all"?bookings:bookings.filter(b=>b.status===sf);
  if(cf!=="all") fil=fil.filter(b=>b.category===cf);
  const sc={active:{bg:"#dcfce7",tx:"#166534"},completed:{bg:"#dbeafe",tx:"#1e40af"},cancelled:{bg:"#fee2e2",tx:"#991b1b"}};
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>All Bookings</h1>
      <p style={{color:"var(--muted)",margin:"0 0 20px",fontSize:13}}>Manage and override bookings</p>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
        {["all","active","completed","cancelled"].map(f=>(
          <button key={f} onClick={()=>setSf(f)} style={{padding:"6px 14px",borderRadius:18,border:"2px solid",borderColor:sf===f?"#1F3D2B":"var(--border)",background:sf===f?"#1F3D2B":"var(--card)",color:sf===f?"#fff":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize"}}>{f}</button>
        ))}
        <select value={cf} onChange={e=>setCf(e.target.value)} style={{marginLeft:"auto",padding:"6px 13px",borderRadius:18,border:"2px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:11,outline:"none",fontFamily:"'DM Sans',sans-serif"}}>
          <option value="all">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Liquor Only">Liquor Only</option>
          <option value="Grocery + Liquor">Grocery + Liquor</option>
        </select>
      </div>
      <div style={{background:"var(--card)",borderRadius:14,overflow:"auto",boxShadow:"var(--shadow)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
          <thead>
            <tr style={{background:"#f9fafb",borderBottom:"1px solid var(--border)"}}>
              {["Token","User","Category","Date & Time","Status","Action"].map(h=>(
                <th key={h} style={{padding:"12px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fil.map((b,i)=>(
              <tr key={b.id} style={{borderBottom:i<fil.length-1?"1px solid var(--border)":"none"}}>
                <td style={{padding:"12px 13px",fontWeight:700,color:"#1F3D2B",fontSize:12}}>{b.tokenNo}</td>
                <td style={{padding:"12px 13px",color:"var(--text)",fontSize:12}}>{b.userName}</td>
                <td style={{padding:"12px 13px",color:"var(--text)",fontSize:11}}>{b.category}</td>
                <td style={{padding:"12px 13px",color:"var(--muted)",fontSize:11}}>{b.date} · {b.time}</td>
                <td style={{padding:"12px 13px"}}><span style={{background:sc[b.status].bg,color:sc[b.status].tx,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:18,textTransform:"uppercase"}}>{b.status}</span></td>
                <td style={{padding:"12px 13px"}}>{b.status==="active"&&<button onClick={()=>{cancelBooking(b.id,b.slotId);showToast("Cancelled by admin","warning");}} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"5px 10px",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {fil.length===0&&<div style={{textAlign:"center",padding:"34px",color:"var(--muted)",fontSize:13}}>No bookings found</div>}
      </div>
    </div>
  );
}

function AdminUsers(){
  const{users,updateUser,showToast}=useApp();
  return(
    <div>
      <h1 style={{fontSize:23,fontWeight:800,margin:"0 0 4px",color:"var(--text)"}}>User Manager</h1>
      <p style={{color:"var(--muted)",margin:"0 0 20px",fontSize:13}}>Approve, disable, and manage members</p>
      <div style={{background:"var(--card)",borderRadius:14,overflow:"auto",boxShadow:"var(--shadow)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
          <thead>
            <tr style={{background:"#f9fafb",borderBottom:"1px solid var(--border)"}}>
              {["Name","Email","Regiment","Role","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"12px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u,i)=>{
              const sc={active:{bg:"#dcfce7",tx:"#166534"},pending:{bg:"#fef3c7",tx:"#92400e"},disabled:{bg:"#fee2e2",tx:"#991b1b"}}[u.status]||{};
              return(
                <tr key={u.id} style={{borderBottom:i<users.length-1?"1px solid var(--border)":"none"}}>
                  <td style={{padding:"12px 13px",fontWeight:600,color:"var(--text)",fontSize:12}}>{u.name}</td>
                  <td style={{padding:"12px 13px",color:"var(--muted)",fontSize:11}}>{u.email}</td>
                  <td style={{padding:"12px 13px",color:"var(--muted)",fontSize:11}}>{u.regiment}</td>
                  <td style={{padding:"12px 13px"}}><span style={{background:u.role==="admin"?"#fef3c7":"#f3f4f6",color:u.role==="admin"?"#92400e":"#555",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:18,textTransform:"uppercase"}}>{u.role}</span></td>
                  <td style={{padding:"12px 13px"}}><span style={{background:sc.bg,color:sc.tx,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:18,textTransform:"uppercase"}}>{u.status}</span></td>
                  <td style={{padding:"12px 13px"}}>
                    <div style={{display:"flex",gap:5}}>
                      {u.status==="pending"&&<button onClick={()=>{updateUser(u.id,{status:"active"});showToast(`${u.name} approved`,"success");}} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"4px 10px",color:"#166534",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Approve</button>}
                      {u.status==="active"&&u.role!=="admin"&&<button onClick={()=>{updateUser(u.id,{status:"disabled"});showToast(`${u.name} disabled`,"warning");}} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:7,padding:"4px 10px",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Disable</button>}
                      {u.status==="disabled"&&<button onClick={()=>{updateUser(u.id,{status:"active"});showToast(`${u.name} re-enabled`,"success");}} style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:7,padding:"4px 10px",color:"#166534",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Enable</button>}
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

// MAIN
export default function App(){
  const[screen,setScreen]=useState("home");
  const[currentUser,setCurrentUser]=useState(null);
  const[page,setPage]=useState("dashboard");
  const[slots,setSlots]=useState(generateSlots);
  const[bookings,setBookings]=useState(INIT_B);
  const[users,setUsers]=useState(USERS);
  const[toasts,setToasts]=useState([]);
  const[dark,setDark]=useState(false);
  const[lang,setLang]=useState("en");

  const showToast=useCallback((msg,type="success")=>{const id=Date.now();setToasts(t=>[...t,{id,message:msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);},[]);
  const removeToast=useCallback(id=>setToasts(t=>t.filter(x=>x.id!==id)),[]);
  const addBooking=useCallback((b,sid)=>{setBookings(x=>[...x,b]);setSlots(s=>s.map(sl=>sl.id===sid?{...sl,booked:sl.booked+1}:sl));},[]);
  const cancelBooking=useCallback((id,sid)=>{setBookings(b=>b.map(x=>x.id===id?{...x,status:"cancelled"}:x));setSlots(s=>s.map(sl=>sl.id===sid?{...sl,booked:Math.max(0,sl.booked-1)}:sl));},[]);
  const updateSlot=useCallback((id,u)=>setSlots(s=>s.map(sl=>sl.id===id?{...sl,...u}:sl)),[]);
  const updateUser=useCallback((id,u)=>setUsers(x=>x.map(usr=>usr.id===id?{...usr,...u}:usr)),[]);

  const vars=dark?D:L;
  const isAdmin=currentUser?.role==="admin";

  if(screen==="home") return <HomePage onGoAuth={m=>setScreen(`auth-${m}`)} lang={lang} setLang={setLang}/>;
  if(screen==="auth-user"||screen==="auth-admin"){
    return <AuthScreen mode={screen==="auth-admin"?"admin":"user"} onLogin={u=>{setCurrentUser(u);setPage(u.role==="admin"?"admin-dashboard":"dashboard");setScreen("app");}} onBack={()=>setScreen("home")} lang={lang} setLang={setLang} users={users} setUsers={setUsers}/>;
  }

  const uPages={dashboard:<UserDashboard onNav={setPage} lang={lang}/>,book:<BookSlot lang={lang}/>,bookings:<MyBookings lang={lang}/>,profile:<UserProfile/>};
  const aPages={"admin-dashboard":<AdminDashboard/>,"admin-slots":<AdminSlots/>,"admin-bookings":<AdminBookings/>,"admin-users":<AdminUsers/>};

  return(
    <Ctx.Provider value={{currentUser,slots,bookings,users,addBooking,cancelBooking,updateSlot,updateUser,showToast}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif}@keyframes toastIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12);border-radius:3px}`}</style>
      <div style={{display:"flex",minHeight:"100vh",background:`${vars.bg}`,"--bg":vars.bg,"--card":vars.card,"--text":vars.text,"--muted":vars.muted,"--border":vars.border,"--shadow":vars.shadow}}>
        {isAdmin
          ?<AdminSidebar active={page} onNav={setPage} user={currentUser} onLogout={()=>{setCurrentUser(null);setScreen("home");}} dark={dark}/>
          :<UserSidebar active={page} onNav={setPage} user={currentUser} onLogout={()=>{setCurrentUser(null);setScreen("home");}} dark={dark} lang={lang} setLang={setLang}/>
        }
        <main style={{marginLeft:230,flex:1,padding:"32px 32px 60px",maxWidth:"calc(100vw - 230px)",overflowX:"hidden","--bg":vars.bg,"--card":vars.card,"--text":vars.text,"--muted":vars.muted,"--border":vars.border,"--shadow":vars.shadow}}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20,gap:8,alignItems:"center"}}>
            <button onClick={()=>setDark(d=>!d)} style={{background:vars.card,border:`2px solid ${vars.border}`,borderRadius:17,padding:"7px 14px",cursor:"pointer",fontSize:12,color:vars.text,fontFamily:"'DM Sans',sans-serif",boxShadow:vars.shadow}}>{dark?"☀️ Light":"🌙 Dark"}</button>
          </div>
          {isAdmin?(aPages[page]||<AdminDashboard/>):(uPages[page]||<UserDashboard onNav={setPage} lang={lang}/>)}
        </main>
      </div>
      <Toast toasts={toasts} remove={removeToast}/>
    </Ctx.Provider>
  );
}
