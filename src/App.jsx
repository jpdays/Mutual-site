import { useState, useEffect, useRef } from "react";

// ── SUPABASE ─────────────────────────────────────────────────
// PROTECTED: These credentials and the submit logic below must be
// preserved in all future edits. Do not remove or bypass.
const SUPABASE_URL = "https://jcgelvlzwfearecpoaxg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dlyG3pjDXQwPt7XRSIsxgA_tN-PItUj";

async function supabaseInsert(table, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

// ── TOKENS ────────────────────────────────────────────────────
const C = {
  forest:  "#243028",
  mossy:   "#3D5040",
  cream:   "#F4EFE6",
  parch:   "#EDE5D8",
  amber:   "#B8723A",
  sage:    "#7A9E82",
  stone:   "#7A7060",
  pale:    "#DDD5C8",
  offwhite:"#FAF6F0",
};
const F = {
  display: '"EB Garamond", Georgia, serif',
  sans:    '"Outfit", -apple-system, sans-serif',
  mono:    '"DM Mono", "SF Mono", monospace',
};

// ── GLOBAL STYLES ─────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{background:${C.cream};color:${C.forest};font-family:${F.sans};overflow-x:hidden;text-align:left}
      body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.025;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")}
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      .reveal{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.25,.46,.45,.94),transform .8s cubic-bezier(.25,.46,.45,.94)}
      .reveal.on{opacity:1;transform:none}
      ::-webkit-scrollbar{width:2px}
      ::-webkit-scrollbar-thumb{background:${C.pale}}
      ::selection{background:${C.amber}33}
      input,select,textarea,button{font-family:${F.sans}}
      button{cursor:pointer}
      @media(max-width:768px){
        .section-pad{padding:5rem 1.5rem !important}
        .hero-pad{padding:6rem 1.5rem 4rem !important}
        .nav-links{display:none !important}
        .nav-center{font-size:.5rem !important;padding:.25rem .65rem !important}
        .survey-wrap{padding:5rem 1.5rem !important}
        .demo-layout{flex-direction:column !important;align-items:center !important}
      }
      @media(max-width:480px){
        .section-pad{padding:4rem 1.2rem !important}
        .hero-pad{padding:5rem 1.2rem 3.5rem !important}
        .survey-wrap{padding:4rem 1.2rem !important}
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
  return null;
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          const d = parseFloat(e.target.dataset.d || 0);
          setTimeout(() => e.target.classList.add("on"), d * 1000);
        }
      }), { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ── PARTICLE CANVAS ───────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const COUNT = Math.max(20, Math.floor((W * H) / 14000));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .33, vy: (Math.random() - .5) * .33,
      r: 1.4 + Math.random() * 1.8, phase: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * .001;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(184,114,58,${.2 - d / 115 * .2})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
        const pulse = Math.sin(t * .8 + p.phase) * .35 + .85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(122,158,130,.5)";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1 }}/>;
}

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      padding:"1.1rem 1.8rem",
      display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",
      background:scrolled?`${C.cream}f2`:"transparent",
      backdropFilter:scrolled?"blur(18px)":"none",
      borderBottom:scrolled?`1px solid ${C.pale}`:"none",
      transition:"all .4s ease",
    }}>
      <span style={{ fontFamily:F.display,fontSize:"1.1rem",fontWeight:500,color:scrolled?C.forest:C.offwhite,transition:"color .4s ease" }}>
        Mutual
      </span>
      <a href="#apply" className="nav-center" style={{
        fontFamily:F.sans,fontWeight:500,fontSize:".65rem",letterSpacing:".08em",
        textTransform:"uppercase",color:C.offwhite,textDecoration:"none",
        padding:".48rem 1.2rem",background:C.amber,borderRadius:999,whiteSpace:"nowrap",
      }}>
        Join the first cohort
      </a>
      <div className="nav-links" style={{ justifySelf:"end",display:"flex",gap:"1.5rem",alignItems:"center" }}>
        {["FAQ","About"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily:F.sans,fontWeight:400,fontSize:".75rem",textDecoration:"none",
            color:scrolled?`${C.forest}99`:`${C.offwhite}bb`,transition:"color .3s ease",
          }}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero-pad" style={{
      minHeight:"100dvh",display:"flex",flexDirection:"column",justifyContent:"flex-end",
      padding:"8rem 3.5rem 5.5rem",position:"relative",overflow:"hidden",
    }}>
      <div style={{ position:"absolute",inset:0,zIndex:0,background:C.forest }}/>
      <ParticleCanvas />
      <div style={{
        position:"absolute",inset:0,zIndex:2,
        background:`linear-gradient(to top, rgba(36,48,40,.97) 18%, rgba(36,48,40,.72) 55%, rgba(36,48,40,.38) 100%)`,
      }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.amber},${C.sage})`,zIndex:3 }}/>
      <div style={{ position:"relative",zIndex:4,maxWidth:860 }}>
        <h1 style={{
          fontFamily:F.display,fontSize:"clamp(3.2rem,9vw,8.5rem)",
          fontWeight:400,lineHeight:.96,color:C.offwhite,
          letterSpacing:"-.01em",marginBottom:"2rem",
          animation:"fadeUp .9s .15s ease both",
        }}>
          <em style={{ color:C.amber,fontStyle:"italic" }}>Your</em> phone.<br/>
          <em style={{ color:C.amber,fontStyle:"italic" }}>Your</em> rules.
        </h1>
        <p style={{
          fontFamily:F.sans,fontWeight:300,fontSize:"clamp(.9rem,1.5vw,1.05rem)",
          lineHeight:1.85,color:`${C.offwhite}99`,maxWidth:520,
          animation:"fadeUp .9s .3s ease both",
        }}>
          We create mutually beneficial technology. A smartphone that keeps everything you need and removes only what you ask it to.
        </p>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────
function Proposition() {
  useReveal();
  const steps = [
    { n:"00", title:"Apply and tell us about your phone", body:"If you have a spare Samsung or Google Pixel, we may be able to work with it. If not, we can arrange a phone for you." },
    { n:"01", title:"You tell us your rules", body:"Block apps completely or set daily time limits. Silence notifications during work hours. Filter specific websites and content. Switch to greyscale after 9pm. Whatever you want to change, write it down." },
    { n:"02", title:"We configure your phone", body:"We set it up at the system level. Not an app you can delete. Not a setting you can toggle off. The rules are set at a level your future self cannot easily undo." },
    { n:"03", title:"You live with it", body:"That's it. We check in. If the rules are not working, we adjust them. You are in control of what the rules are." },
  ];
  return (
    <section className="section-pad" style={{ padding:"8rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}` }}>
      <div style={{ maxWidth:820,margin:"0 auto" }}>
        <div className="reveal" style={{ fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"3rem",fontWeight:"bold" }}>
          How it works
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
          {steps.map((s,i) => (
            <div key={i} className="reveal" data-d={i*.1} style={{
              display:"grid",gridTemplateColumns:"2.5rem 1fr",gap:".75rem",
              padding:"2.5rem 0",borderTop:`1px solid ${C.pale}`,
            }}>
              <span style={{ fontFamily:F.mono,fontSize:".72rem",color:C.stone,paddingTop:".35rem",fontWeight:"bold" }}>{s.n}</span>
              <div>
                <div style={{ fontFamily:F.display,fontWeight:500,fontSize:"1.4rem",color:C.forest,marginBottom:".65rem" }}>{s.title}</div>
                <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:C.stone,lineHeight:1.85 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" data-d=".3" style={{ marginTop:"3.5rem",padding:"2rem 2.5rem",background:C.forest,borderRadius:16 }}>
          <p style={{ fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(1.1rem,2.2vw,1.5rem)",color:C.offwhite,lineHeight:1.6 }}>
            You decide how you use your phone. We make it stick.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── EVE DEMO ──────────────────────────────────────────────────
const _sleep = ms => new Promise(r => setTimeout(r, ms));

// Samsung-style app set with notification badges
const GRID_APPS = [
  { id:"maps",      name:"Maps",      bg:"#fff",    border:true           },
  { id:"nhs",       name:"NHS",       bg:"#005EB8"                        },
  { id:"teams",     name:"Teams",     bg:"#4B53BC", badge:3               },
  { id:"duolingo",  name:"Duolingo",  bg:"#58CC02"                        },
  { id:"linkedin",  name:"LinkedIn",  bg:"#0A66C2", badge:4               },
  { id:"youtube",   name:"YouTube",   bg:"#FF0000"                        },
  { id:"instagram", name:"Instagram", bg:"linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)", badge:7 },
  { id:"pinterest", name:"Pinterest", bg:"#E60023"                        },
  { id:"whatsapp",  name:"WhatsApp",  bg:"#25D366", badge:12              },
  { id:"news",      name:"News",      bg:"#fff",    border:true, badge:5  },
  { id:"calendar",  name:"Calendar",  bg:"#fff",    border:true           },
  { id:"settings",  name:"Settings",  bg:"#eee"                           },
  { id:"camera",    name:"Camera",    bg:"#1C1C1E"                        },
  { id:"photos",    name:"Photos",    bg:"#fff",    border:true           },
  { id:"calculator",name:"Calculator",bg:"#1C1C1E"                        },
  { id:"amazon",    name:"Amazon",    bg:"#131921"                        },
  { id:"spotify",   name:"Spotify",   bg:"#191414"                        },
  { id:"netflix",   name:"Netflix",   bg:"#141414"                        },
  { id:"gmail",     name:"Gmail",     bg:"#fff",    border:true, badge:9  },
  { id:"chess",     name:"Chess",     bg:"#739552", badge:2               },
];

const DOCK_APPS = [
  { id:"calls",    name:"Calls",    bg:"#34C759"               },
  { id:"chrome",   name:"Chrome",   bg:"#fff",   border:true   },
  { id:"messages", name:"Messages", bg:"#34C759", badge:2      },
  { id:"eve",      name:"Eve",      bg:"#1A2E22", isEve:true   },
];

const ANALYSIS = [
  { text:"Reviewing app usage — last 14 days...", kind:"head" },
  { text:"Instagram: 1h 42m average daily",       kind:"data" },
  { text:"Pinterest: 38m average daily",          kind:"data" },
  { text:"LinkedIn: 34m average daily",           kind:"data" },
  { text:"YouTube: 51m average daily",            kind:"data" },
  { text:"WhatsApp: active throughout the day",   kind:"data" },
  { text:"",                                      kind:"gap"  },
  { text:"Cross-referencing with calendar...",    kind:"head" },
  { text:"Work hours identified: 9am – 6pm",      kind:"data" },
  { text:"High usage overlap detected during work hours", kind:"warn" },
  { text:"Notification interruptions: avg 47 per day",    kind:"warn" },
  { text:"Most frequent unlock trigger: Instagram",       kind:"warn" },
  { text:"",                                      kind:"gap"  },
  { text:"Creating a personalised plan now.",     kind:"end"  },
];


function getIconContent(id) {
  switch(id) {
    case "maps": return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
        <path d="M5 9C5 5.13 8.13 2 12 2v14S5 14.25 5 9z" fill="#C5221F" opacity=".35"/>
        <circle cx="12" cy="9" r="2.8" fill="white"/>
      </svg>
    );
    case "amex": return <span style={{fontSize:"7.5px",fontWeight:800,color:"#fff",fontFamily:"Arial,sans-serif",letterSpacing:".5px"}}>AMEX</span>;
    case "teams": return (
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <rect x="4" y="8" width="13" height="2.5" rx="1.2" fill="white"/>
        <rect x="10" y="8" width="2.5" height="9.5" rx="1.2" fill="white"/>
        <circle cx="18" cy="6.5" r="2.8" fill="#7B83EB"/>
        <text x="18" y="8.9" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="white" fontFamily="Arial,sans-serif">t</text>
      </svg>
    );
    case "duolingo": return <span style={{fontSize:"22px",lineHeight:1}}>🦉</span>;
    case "linkedin": return <span style={{fontSize:"16px",fontWeight:900,color:"#fff",fontFamily:"'Arial Black',Arial,sans-serif",letterSpacing:"-1px"}}>in</span>;
    case "youtube": return (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <polygon points="9,4 22,10 9,16" fill="white"/>
      </svg>
    );
    case "instagram": return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="5" stroke="white" strokeWidth="2"/>
        <circle cx="11" cy="11" r="4" stroke="white" strokeWidth="2"/>
        <circle cx="16.2" cy="5.8" r="1.2" fill="white"/>
      </svg>
    );
    case "pinterest": return (
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
        <text x="11" y="22" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white" fontFamily="Georgia,serif">P</text>
      </svg>
    );
    case "whatsapp": return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="white" opacity=".93"/>
        <path d="M8 9.5c.15-.32.6-1.1 1.05-1.3.45-.2.7 0 .8.15l.9 1.9c.1.2 0 .45-.18.6l-.5.5c-.1.1-.1.25 0 .35.45.75 1.1 1.4 1.85 1.85.1.1.25.1.35 0l.5-.5c.2-.18.45-.28.6-.18l1.9.9c.15.1.35.35.15.8-.2.45-1 .9-1.3 1.05-.3.15-1.6.15-3.6-1.85S7.85 9.8 8 9.5z" fill="#25D366"/>
      </svg>
    );
    case "news": return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="1.5" fill="#EA4335"/>
        <rect x="13" y="2" width="9" height="9" rx="1.5" fill="#4285F4"/>
        <rect x="2" y="13" width="9" height="9" rx="1.5" fill="#FBBC04"/>
        <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#34A853"/>
      </svg>
    );
    case "calendar": return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",height:"100%",overflow:"hidden"}}>
        <div style={{background:"#4285F4",width:"100%",padding:"2px 0",textAlign:"center",flexShrink:0,borderRadius:"10px 10px 0 0"}}>
          <span style={{fontSize:"6px",fontWeight:600,color:"#fff",letterSpacing:".05em",fontFamily:"Roboto,Arial,sans-serif",textTransform:"uppercase"}}>Tue</span>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:"17px",fontWeight:300,color:"#1C1C1E",fontFamily:"Roboto,Arial,sans-serif",lineHeight:1}}>17</span>
        </div>
      </div>
    );
    case "settings": return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="#555" strokeWidth="2"/>
        <path d="M11 2v2.5M11 17.5V20M2 11h2.5M17.5 11H20M4.9 4.9l1.8 1.8M15.3 15.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 15.3l-1.8 1.8" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
    case "camera": return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
        <path d="M21 16a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v9z" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="11" r="3.2" stroke="white" strokeWidth="1.5"/>
      </svg>
    );
    case "photos": return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5v3" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M12 17.5v3" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M3.5 12h3" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M17.5 12h3" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M6.2 6.2l2.1 2.1" stroke="#EA4335" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M15.7 15.7l2.1 2.1" stroke="#34A853" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M17.8 6.2l-2.1 2.1" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M8.3 15.7l-2.1 2.1" stroke="#FBBC04" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2.5" fill="#BDBDBD"/>
      </svg>
    );
    case "calculator": return (
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <rect x="2" y="2" width="16" height="18" rx="2.5" fill="#3A3A3C"/>
        <rect x="4" y="4" width="12" height="5" rx="1" fill="#FF9500"/>
        <rect x="4" y="11" width="3.5" height="3" rx=".7" fill="#8E8E93"/>
        <rect x="8.3" y="11" width="3.5" height="3" rx=".7" fill="#8E8E93"/>
        <rect x="12.5" y="11" width="3.5" height="3" rx=".7" fill="#FF9500"/>
        <rect x="4" y="15.5" width="3.5" height="3" rx=".7" fill="#8E8E93"/>
        <rect x="8.3" y="15.5" width="3.5" height="3" rx=".7" fill="#8E8E93"/>
        <rect x="12.5" y="15.5" width="3.5" height="3" rx=".7" fill="#FF3B30"/>
      </svg>
    );
    case "amazon": return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <text x="12" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF9900" fontFamily="Arial,sans-serif">a</text>
        <path d="M5.5 18c3.5 2 10 2 13 0" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 17l1.8 1.2-1.2 1.2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
    case "spotify": return (
      <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
        <path d="M3 5c5-2.5 12-2.5 16 0" stroke="#1DB954" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M4.5 10c4-2 9.5-2 13 0" stroke="#1DB954" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M6 15c3-1.2 7-1.2 10 0" stroke="#1DB954" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
    case "netflix": return <span style={{fontSize:"17px",fontWeight:900,color:"#E50914",fontFamily:"'Arial Black',Arial,sans-serif",letterSpacing:"-1px"}}>N</span>;
    case "gmail": return (
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <path d="M1.5 2.5L13 12.5 24.5 2.5" stroke="#EA4335" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="1" y="2" width="2" height="15" rx="1" fill="#34A853"/>
        <rect x="23" y="2" width="2" height="15" rx="1" fill="#FBBC04"/>
        <path d="M1 2L13 12.5 25 2 25 17.5 1 17.5Z" stroke="#4285F4" strokeWidth="1.2" fill="none"/>
      </svg>
    );
    case "chess": return <span style={{fontSize:"21px",lineHeight:1}}>♟️</span>;
    case "nhs": return <span style={{fontSize:"10px",fontWeight:900,color:"#fff",fontFamily:"Arial,sans-serif",letterSpacing:".5px"}}>NHS</span>;
    case "calls": return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5.5 2.5c0 0-2 2-2 5.5C3.5 16.5 13 21 16.5 19l-2-4-3 1.5S9 15 7.5 13.5 6.5 9 6.5 9L8 6 5.5 2.5z" fill="white"/>
      </svg>
    );
    case "chrome": return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 12L12 4A8 8 0 0 1 18.93 16Z" fill="#EA4335"/>
        <path d="M12 12L18.93 16A8 8 0 0 1 5.07 16Z" fill="#34A853"/>
        <path d="M12 12L5.07 16A8 8 0 0 1 12 4Z" fill="#FBBC04"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
        <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
      </svg>
    );
    case "messages": return (
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <path d="M3 3h18a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0121 15H7L3.5 19.5V4.5A1.5 1.5 0 013 3z" fill="white"/>
        <circle cx="8" cy="9.5" r="1.3" fill="#34C759"/>
        <circle cx="12" cy="9.5" r="1.3" fill="#34C759"/>
        <circle cx="16" cy="9.5" r="1.3" fill="#34C759"/>
      </svg>
    );
    case "eve": return <span style={{fontSize:"16px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif",letterSpacing:"-0.5px"}}>E</span>;
    default: return null;
  }
}

function WeatherWidget() {
  return (
    <div style={{
      gridColumn:"span 2",gridRow:"span 2",
      background:"rgba(255,255,255,0.15)",
      border:"1px solid rgba(255,255,255,.2)",
      borderRadius:16,padding:"10px 13px",
      display:"flex",flexDirection:"column",justifyContent:"space-between",
      boxShadow:"0 2px 10px rgba(0,0,0,.18)",
    }}>
      <div>
        <div style={{fontFamily:"Roboto,Arial,sans-serif",fontSize:"9px",color:"rgba(255,255,255,.8)",fontWeight:400,marginBottom:2}}>London</div>
        <div style={{fontFamily:"Roboto,Arial,sans-serif",fontSize:"33px",fontWeight:200,color:"#fff",lineHeight:1}}>12°</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontFamily:"Roboto,Arial,sans-serif",fontSize:"9.5px",color:"rgba(255,255,255,.9)"}}>Cloudy</div>
          <div style={{fontFamily:"Roboto,Arial,sans-serif",fontSize:"8px",color:"rgba(255,255,255,.55)"}}>H:15°  L:8°</div>
        </div>
        <span style={{fontSize:"22px",lineHeight:1}}>☁️</span>
      </div>
    </div>
  );
}

function AppIcon({ app, hidden, tapped, badges, onDark }) {
  const isGradient = app.bg && app.bg.startsWith("linear");
  const badgeCount = (badges && badges[app.id] !== undefined) ? badges[app.id] : (app.badge || 0);
  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",gap:2,
      opacity:hidden?0:1,
      transform:hidden?"scale(0.28)":tapped===app.id?"scale(0.88)":"scale(1)",
      transition:"opacity .65s ease, transform .65s cubic-bezier(.34,1.2,.64,1)",
    }}>
      <div style={{ position:"relative" }}>
        <div style={{
          width:44,height:44,borderRadius:12,
          background:app.bg,
          border:app.border?"1px solid rgba(0,0,0,.1)":"none",
          boxShadow:"0 2px 6px rgba(0,0,0,.15)",
          display:"flex",alignItems:"center",justifyContent:"center",
          overflow:"hidden",
        }}>
          {getIconContent(app.id)}
        </div>
        {badgeCount > 0 && (
          <div style={{
            position:"absolute",top:-4,right:-4,
            minWidth:17,height:17,borderRadius:9,
            background:"#FF3B30",border:"1.5px solid white",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"Roboto,Arial,sans-serif",fontSize:"9px",fontWeight:700,color:"#fff",
            padding:"0 3px",transition:"all .35s ease",letterSpacing:"-0.3px",
          }}>{badgeCount}</div>
        )}
      </div>
      <span style={{
        fontFamily:"Roboto,Arial,sans-serif",fontSize:"8px",
        color: onDark ? "rgba(255,255,255,.88)" : "#1C1C1E",
        lineHeight:1,
        textShadow: onDark ? "0 1px 3px rgba(0,0,0,.55)" : "none",
        maxWidth:48,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center",
      }}>{app.name}</span>
    </div>
  );
}

function Bubble({ side, text }) {
  return (
    <div style={{
      display:"flex",justifyContent:side==="user"?"flex-end":"flex-start",
      alignItems:"flex-end",gap:5,
      animation:"fadeUp .3s ease both",flexShrink:0,
    }}>
      {side==="eve" && (
        <div style={{ width:26,height:26,borderRadius:8,flexShrink:0,background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2 }}>
          <span style={{ fontSize:"10px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
        </div>
      )}
      <div style={{
        maxWidth:"76%",padding:"8px 11px",
        borderRadius:side==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
        background:side==="user"?"#1E75FF":"#EAEAEA",
        boxShadow:"0 1px 2px rgba(0,0,0,.07)",
      }}>
        <span style={{
          fontFamily:"Roboto,Arial,sans-serif",
          fontSize:"11.5px",fontWeight:400,
          color:side==="user"?"#fff":"#1C1C1E",
          lineHeight:1.44,display:"block",
        }}>{text}</span>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display:"flex",alignItems:"flex-end",gap:5,animation:"fadeUp .28s ease both",flexShrink:0 }}>
      <div style={{ width:26,height:26,borderRadius:8,flexShrink:0,background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2 }}>
        <span style={{ fontSize:"10px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
      </div>
      <div style={{ padding:"10px 13px",borderRadius:"18px 18px 18px 4px",background:"#EAEAEA",display:"flex",gap:4,alignItems:"center" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:5,height:5,borderRadius:"50%",background:"#8E8E93",animation:`fadeUp .55s ${i*.16}s ease infinite alternate` }}/>
        ))}
      </div>
    </div>
  );
}

function EveDemo() {
  const [screen,    setScreen]    = useState("home");
  const [msgs,      setMsgs]      = useState([]);
  const [input,     setInput]     = useState("");
  const [typing,    setTyping]    = useState(false);
  const [alines,    setAlines]    = useState([]);
  const [analysing, setAnalysing] = useState(false);
  const [hidden,    setHidden]    = useState(new Set());
  const [badges,    setBadges]    = useState({});
  const [grey,      setGrey]      = useState(false);
  const [mode,      setMode]      = useState("");
  const [clock,     setClock]     = useState("10:47");
  const [bq,        setBq]        = useState("");
  const [blocked,   setBlocked]   = useState(false);
  const [tapped,    setTapped]    = useState(null);
  const idRef = useRef(0);

  const INIT_BADGES = { whatsapp:150, instagram:20, news:12, linkedin:30, gmail:9, teams:3, messages:2, chess:2 };

  useEffect(() => {
    let dead = false;

    const addMsg = (side, text) => {
      if (dead) return;
      setMsgs(prev => [...prev, { id: ++idRef.current, side, text }]);
    };

    const typeIn = async (text, setter, ms = 52) => {
      let s = "";
      for (const ch of text) {
        if (dead) return;
        s += ch; setter(s);
        await _sleep(ms + Math.random() * 18);
      }
    };

    const eveReply = async (text, wait = 1000) => {
      if (dead) return;
      setTyping(true);
      await _sleep(wait);
      if (dead) return;
      setTyping(false);
      addMsg("eve", text);
      await _sleep(350);
    };

    const userSend = async (text, ms = 50) => {
      if (dead) return;
      await typeIn(text, setInput, ms);
      if (dead) return;
      await _sleep(220);
      setInput("");
      addMsg("user", text);
      await _sleep(500);
    };

    const run = async () => {
      while (!dead) {
        // RESET
        setScreen("home"); setMsgs([]); setInput(""); setTyping(false);
        setAlines([]); setAnalysing(false); setHidden(new Set());
        setBadges(INIT_BADGES); setGrey(false); setMode("");
        setClock("10:47"); setBq(""); setBlocked(false); setTapped(null);
        idRef.current = 0;

        await _sleep(1800); if (dead) return;

        // Tap Eve in dock
        setTapped("eve"); await _sleep(200); setTapped(null); await _sleep(600);
        setScreen("eve"); await _sleep(700); if (dead) return;

        // Scene 1
        await userSend("I've been spending too much time on my phone. I want to change that.", 50);
        if (dead) return;

        await eveReply("Let me take a look at how you've been using it.", 950);
        if (dead) return;

        // Scene 2 — analysis (longer dwell so user reads Eve's reply)
        await _sleep(2600); if (dead) return;
        setAnalysing(true); setAlines([]);
        for (const line of ANALYSIS) {
          if (dead) return;
          await _sleep(line.kind==="gap"?900:line.kind==="end"?950:line.kind==="head"?700:620);
          if (dead) return;
          setAlines(prev => [...prev, line]);
        }
        await _sleep(1800); if (dead) return;
        setAnalysing(false);

        // Scene 3 — plan (keep existing msgs so conversation is continuous)
        setAlines([]); await _sleep(400); if (dead) return;

        await eveReply("Based on your usage, I'd suggest blocking Instagram, Pinterest, LinkedIn and YouTube completely during work hours and keeping WhatsApp available. Want to go further?", 850);
        if (dead) return;
        await _sleep(2600);

        await userSend("Yes. Most notifications are distracting too. And make the phone less tempting to pick up.", 48);
        if (dead) return;

        await eveReply("Got it. I can silence all notifications during work hours except your boss and partner. And I can switch your phone to greyscale.", 1100);
        if (dead) return;
        await _sleep(950);

        await eveReply("Let's try this for two weeks. I'll check in with you on the 14th to see if it's working. You can adjust anything before then.", 850);
        if (dead) return;
        await _sleep(2400);

        await userSend("Let's do it.", 55);
        if (dead) return;
        await _sleep(3200);

        // Scene 4 — change
        setScreen("change"); await _sleep(1400); if (dead) return;

        // 6A — apps disappear
        setHidden(new Set(["instagram","pinterest","linkedin","youtube"]));
        await _sleep(1600); if (dead) return;

        // 6B — badge drop: dramatic multi-step reduction
        setBadges({ whatsapp:80, instagram:12, linkedin:18, news:7, gmail:5, teams:2 });
        await _sleep(700); if (dead) return;
        setBadges({ whatsapp:40, instagram:5, linkedin:6, news:3, gmail:2, teams:1 });
        await _sleep(700); if (dead) return;
        setBadges({ whatsapp:18, instagram:1, linkedin:2, news:1, gmail:1 });
        await _sleep(700); if (dead) return;
        setBadges({ whatsapp:6 });
        await _sleep(700); if (dead) return;

        // 6C — greyscale
        setGrey(true); await _sleep(1800); if (dead) return;

        // 6D — mode label
        setMode("No distractions until 6pm."); await _sleep(1500); if (dead) return;

        // Time jump
        setClock("11:23"); await _sleep(900); if (dead) return;

        // Tap Chrome in dock — visible touch reaction
        setTapped("chrome"); await _sleep(300); setTapped(null); await _sleep(400);

        // Browser proof
        setScreen("browser"); setBq(""); setBlocked(false);
        await _sleep(1000); if (dead) return;
        await typeIn("instagram.com", setBq, 65);
        if (dead) return;
        await _sleep(700);
        setBlocked(true);
        await _sleep(4500); if (dead) return;
        await _sleep(800);
      }
    };

    run();
    return () => { dead = true; };
  }, []);

  const onHomeScreen = screen === "home" || screen === "change";
  const tcStatus = grey ? "#777" : (onHomeScreen ? "#fff" : "#1C1C1E");

  // ── SAMSUNG ONE UI STATUS BAR ──────────────────────────────────
  const StatusBar = (
    <div style={{ position:"relative",flexShrink:0,height:38,display:"flex",alignItems:"center",padding:"0 16px" }}>
      {/* Punch-hole camera */}
      <div style={{
        position:"absolute",top:9,left:"50%",transform:"translateX(-50%)",
        width:9,height:9,background:"#000",borderRadius:"50%",zIndex:10,
      }}/>
      <span style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"12px",fontWeight:400,color:tcStatus,letterSpacing:".1px" }}>{clock}</span>
      <div style={{ marginLeft:"auto",display:"flex",gap:5,alignItems:"center" }}>
        <div style={{ display:"flex",gap:1.5,alignItems:"flex-end",height:9 }}>
          {[3,5,7,9].map((h,i) => <div key={i} style={{ width:2.5,height:h,borderRadius:.8,background:tcStatus,opacity:i<3?1:.28 }}/>)}
        </div>
        <svg width="12" height="9" viewBox="0 0 13 10" fill="none">
          <path d="M6.5 8.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z" fill={tcStatus}/>
          <path d="M3.6 5.8a4.1 4.1 0 0 1 5.8 0" stroke={tcStatus} strokeWidth="1.1" strokeLinecap="round" fill="none"/>
          <path d="M1 3.2A7.5 7.5 0 0 1 12 3.2" stroke={tcStatus} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".5"/>
        </svg>
        <div style={{ display:"flex",alignItems:"center" }}>
          <div style={{ width:19,height:9,borderRadius:2,border:`1.1px solid ${tcStatus}88`,padding:"1.5px" }}>
            <div style={{ width:"78%",height:"100%",borderRadius:1,background:tcStatus }}/>
          </div>
          <div style={{ width:1.5,height:4,borderRadius:"0 1px 1px 0",background:tcStatus,opacity:.5 }}/>
        </div>
      </div>
    </div>
  );

  const HomeScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",padding:"4px 12px 0" }}>
      <div style={{
        flex:1,display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"9px 4px",alignContent:"start",paddingTop:2,
      }}>
        <WeatherWidget/>
        {GRID_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped} badges={badges} onDark={!grey}/>)}
      </div>
      {/* Samsung dock — clean divider, no frosted card */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.12)",padding:"9px 6px 11px",display:"flex",justifyContent:"space-around" }}>
        {DOCK_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped} badges={badges} onDark={!grey}/>)}
      </div>
    </div>
  );

  const EveScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff" }}>
      <div style={{ padding:"5px 14px 7px",flexShrink:0,borderBottom:"1px solid rgba(0,0,0,.07)",background:"#FAFAFA",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:30,height:30,borderRadius:8,background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:"11px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
        </div>
        <div>
          <div style={{ fontFamily:"Roboto,Arial,sans-serif",fontWeight:500,fontSize:"13px",color:"#1C1C1E" }}>Eve</div>
          <div style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"10px",color:analysing?"#FF9500":"#34C759" }}>
            {analysing?"Analysing…":"Active now"}
          </div>
        </div>
        {analysing && (
          <div style={{ marginLeft:"auto",display:"flex",gap:3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:4,height:4,borderRadius:"50%",background:"#FF9500",animation:`fadeUp .7s ${i*.2}s ease infinite alternate` }}/>)}
          </div>
        )}
      </div>
      <div style={{ flex:1,overflow:"hidden",position:"relative",background:"#fff" }}>
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          display:"flex",flexDirection:"column",
          padding:analysing?"10px 14px":"8px 12px",
          gap:analysing?3:8,
        }}>
          {analysing ? (
            alines.slice(-14).map((l, i) => (
              l.kind==="gap" ? (
                <div key={i} style={{ height:4 }}/>
              ) : (
                <div key={i} style={{
                  fontFamily:"ui-monospace,'SF Mono',Menlo,monospace",
                  fontSize:l.kind==="end"?"11px":"10px",
                  lineHeight:1.52,
                  color:l.kind==="end"?"#1C1C1E":l.kind==="warn"?"#E53935":l.kind==="head"?"#8E8E93":"#3C3C43",
                  fontWeight:l.kind==="end"?600:400,
                  paddingLeft:(l.kind==="data"||l.kind==="warn")?10:0,
                  animation:"fadeUp .3s ease both",
                }}>{l.text}</div>
              )
            ))
          ) : (
            <>
              {msgs.slice(-4).map(m => <Bubble key={m.id} side={m.side} text={m.text}/>)}
              {typing && <TypingDots/>}
            </>
          )}
        </div>
      </div>
      {!analysing && (
        <div style={{ padding:"5px 10px 8px",flexShrink:0,borderTop:"1px solid rgba(0,0,0,.07)",background:"#FAFAFA",display:"flex",alignItems:"center",gap:6 }}>
          <div style={{
            flex:1,background:"#fff",border:"1px solid #D1D1D6",borderRadius:22,
            padding:"7px 12px",minHeight:30,
            fontFamily:"Roboto,Arial,sans-serif",fontSize:"11px",
            color:input?"#1C1C1E":"#B0B0B8",
            display:"flex",alignItems:"center",lineHeight:1.4,
          }}>
            <span style={{ flex:1 }}>{input||"Message Eve…"}</span>
            {input && <span style={{ display:"inline-block",width:1.5,height:"0.85em",background:"#1E75FF",marginLeft:1,animation:"blink 1s step-end infinite" }}/>}
          </div>
          <div style={{
            width:30,height:30,borderRadius:"50%",flexShrink:0,
            background:input?"#1E75FF":"#E9E9EB",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"background .2s ease",
          }}>
            <span style={{ color:input?"#fff":"#8E8E93",fontSize:"11px",lineHeight:1,transform:"rotate(-90deg)",display:"block" }}>▲</span>
          </div>
        </div>
      )}
    </div>
  );

  const ChangeScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",padding:"0 12px",position:"relative" }}>
      {/* Floating mode label — does not affect layout */}
      {mode && (
        <div style={{
          position:"absolute",top:6,left:12,right:12,zIndex:10,
          background:grey?"rgba(60,60,60,.82)":"rgba(0,0,0,.52)",
          backdropFilter:"blur(8px)",
          borderRadius:10,padding:"6px 10px",
          animation:"fadeUp .5s ease both",
          pointerEvents:"none",
        }}>
          <span style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"10px",fontWeight:500,color:"rgba(255,255,255,.92)" }}>{mode}</span>
        </div>
      )}
      <div style={{
        flex:1,display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        gap:"9px 4px",alignContent:"start",paddingTop:4,
      }}>
        <WeatherWidget/>
        {GRID_APPS.map(a => <AppIcon key={a.id} app={a} hidden={hidden.has(a.id)} tapped={tapped} badges={badges} onDark={!grey}/>)}
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.12)",padding:"9px 6px 11px",display:"flex",justifyContent:"space-around" }}>
        {DOCK_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped} badges={badges} onDark={!grey}/>)}
      </div>
    </div>
  );

  const BrowserScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:"#fff" }}>
      {/* Chrome address bar */}
      <div style={{ padding:"6px 10px 7px",flexShrink:0,borderBottom:"1px solid rgba(0,0,0,.08)",background:"#F8F9FA",display:"flex",alignItems:"center",gap:6 }}>
        {/* Chrome icon pill */}
        <div style={{ width:20,height:20,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 12L12 4A8 8 0 0 1 18.93 16Z" fill="#EA4335"/>
            <path d="M12 12L18.93 16A8 8 0 0 1 5.07 16Z" fill="#34A853"/>
            <path d="M12 12L5.07 16A8 8 0 0 1 12 4Z" fill="#FBBC04"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
            <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
          </svg>
        </div>
        <div style={{ flex:1,background:"#fff",borderRadius:20,padding:"5px 10px",border:"1px solid #E0E0E0",display:"flex",alignItems:"center",gap:5,minHeight:28 }}>
          <span style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"11px",color:"#1C1C1E",flex:1 }}>
            {bq || <span style={{ color:"#9AA0A6" }}>Search or type URL</span>}
            {bq && !blocked && <span style={{ display:"inline-block",width:1.5,height:"0.85em",background:"#1A73E8",marginLeft:1,animation:"blink 1s step-end infinite" }}/>}
          </span>
          {bq && <div style={{ width:9,height:9,borderRadius:"50%",background:"#5F6368",opacity:.5,flexShrink:0 }}/>}
        </div>
      </div>
      {blocked ? (
        <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,gap:14,animation:"fadeUp .5s ease both" }}>
          <div style={{ width:50,height:50,borderRadius:14,background:"#F2F2F7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px" }}>🔒</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"Roboto,Arial,sans-serif",fontWeight:500,fontSize:"13px",color:"#1C1C1E",marginBottom:6,lineHeight:1.3 }}>Instagram is off until 6pm.</div>
            <div style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"11.5px",color:"#8E8E93",lineHeight:1.5 }}>Enjoy the focus.</div>
          </div>
        </div>
      ) : (
        /* Google-style new tab page */
        <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:22,gap:14 }}>
          {/* Google logo */}
          <div style={{ display:"flex",alignItems:"center",gap:0 }}>
            {[["#4285F4","G"],["#EA4335","o"],["#FBBC04","o"],["#4285F4","g"],["#34A853","l"],["#EA4335","e"]].map(([c,l],i)=>(
              <span key={i} style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"22px",fontWeight:700,color:c,lineHeight:1 }}>{l}</span>
            ))}
          </div>
          {/* Fake search bar */}
          <div style={{ width:"85%",background:"#fff",borderRadius:22,border:"1px solid #E0E0E0",padding:"7px 12px",display:"flex",alignItems:"center",gap:6,boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
            <svg width="11" height="11" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="#9AA0A6" strokeWidth="1.8"/><line x1="11.5" y1="11.5" x2="15" y2="15" stroke="#9AA0A6" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <span style={{ fontFamily:"Roboto,Arial,sans-serif",fontSize:"10px",color:"#9AA0A6" }}>Search Google or type a URL</span>
          </div>
          {/* Shortcut tiles */}
          <div style={{ display:"flex",gap:10 }}>
            {[["#4285F4","G"],["#FF0000","▶"],["#E60023","P"],["#1877F2","f"]].map(([c,l],i)=>(
              <div key={i} style={{ width:36,height:36,borderRadius:10,background:"#F1F3F4",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:"14px",fontWeight:700,color:c }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Samsung Galaxy wallpaper — deep blue gradient
  const wallpaperStyle = {
    background: grey
      ? "linear-gradient(160deg,#c8ccd6 0%,#e2e4ea 100%)"
      : "linear-gradient(160deg,#1a2a5e 0%,#1e3a6e 30%,#2d5ba8 60%,#4a86c8 100%)",
    transition:"background 1.8s ease",
  };

  return (
    <div style={{
      width:258,height:530,flexShrink:0,
      background:"#1A1A1A",
      borderRadius:40,
      padding:"0 4px 4px",
      boxShadow:[
        "0 0 0 1px rgba(255,255,255,.08)",
        "0 0 0 2.5px #000",
        "inset 0 0 0 1px rgba(255,255,255,.04)",
        "0 24px 60px rgba(0,0,0,.52)",
        "0 4px 16px rgba(0,0,0,.28)",
      ].join(","),
      position:"relative",
    }}>
      {/* Samsung power button — right side */}
      <div style={{ position:"absolute",right:-3,top:70,width:3,height:42,background:"#2A2A2A",borderRadius:"0 2px 2px 0",boxShadow:"inset -1px 0 1px rgba(0,0,0,.5)" }}/>
      {/* Volume up */}
      <div style={{ position:"absolute",left:-3,top:86,width:3,height:30,background:"#2A2A2A",borderRadius:"2px 0 0 2px",boxShadow:"inset 1px 0 1px rgba(0,0,0,.5)" }}/>
      {/* Volume down */}
      <div style={{ position:"absolute",left:-3,top:126,width:3,height:30,background:"#2A2A2A",borderRadius:"2px 0 0 2px",boxShadow:"inset 1px 0 1px rgba(0,0,0,.5)" }}/>

      <div style={{
        width:"100%",height:"100%",
        borderRadius:36,overflow:"hidden",
        display:"flex",flexDirection:"column",
        ...wallpaperStyle,
        filter:grey?"saturate(0) brightness(0.88)":"none",
        transition:"filter 1.8s ease",
      }}>
        {StatusBar}
        <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column" }}>
          {screen==="home"    && HomeScreen}
          {screen==="eve"     && EveScreen}
          {screen==="change"  && ChangeScreen}
          {screen==="browser" && BrowserScreen}
        </div>
        {/* Samsung home indicator */}
        <div style={{ height:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <div style={{ width:80,height:3.5,borderRadius:2,background:tcStatus,opacity:.2 }}/>
        </div>
      </div>
    </div>
  );
}

// ── EVE DEMO SECTION ─────────────────────────────────────────
function Differentiation() {
  useReveal();
  return (
    <section className="section-pad" style={{ padding:"7rem 3rem",background:C.cream,borderTop:`1px solid ${C.pale}` }}>
      <div style={{ maxWidth:900,margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:"4rem" }}>
          <div style={{ fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:".75rem",fontWeight:"bold" }}>Meet Eve</div>
        </div>
        <div className="reveal demo-layout" data-d=".1" style={{ display:"flex",gap:"3.5rem",alignItems:"flex-start",flexWrap:"wrap" }}>
          <EveDemo/>
          <div style={{ flex:1,minWidth:220,paddingTop:"1.5rem" }}>
            <div style={{ display:"flex",flexDirection:"column",gap:"1.8rem" }}>
              {[
                { n:"01",title:"Tell Eve what you want to achieve in plain language.",body:"Eve listens in plain language, then gets to work." },
                { n:"02",title:"Eve analyses your data usage and comes up with a plan.",body:"" },
                { n:"03",title:"You adjust and implement it.",body:"" },
                { n:"04",title:"The phone changes.",body:"" },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex",gap:".75rem" }}>
                  <span style={{ fontFamily:F.mono,fontSize:".6rem",color:C.sage,fontWeight:"bold",paddingTop:".2rem",flexShrink:0 }}>{item.n}</span>
                  <div>
                    <div style={{ fontFamily:F.display,fontWeight:500,fontSize:"1rem",color:C.forest,marginBottom:item.body?".35rem":0 }}>{item.title}</div>
                    {item.body && <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:".85rem",color:C.stone,lineHeight:1.75 }}>{item.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WHO THIS IS FOR ───────────────────────────────────────────
function WhoThisIsFor() {
  useReveal();
  return (
    <section className="section-pad" style={{ padding:"7rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}` }}>
      <div style={{ maxWidth:820,margin:"0 auto" }}>
        <div className="reveal" style={{ fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"3rem",fontWeight:"bold" }}>
          Who this is for
        </div>
        <h2 className="reveal" style={{ fontFamily:F.display,fontSize:"clamp(1.9rem,3.5vw,2.8rem)",fontWeight:400,lineHeight:1.2,color:C.forest,marginBottom:"3rem" }}>
          You've tried the other solutions.<br/>
          <em style={{ fontStyle:"italic",color:C.amber }}>They didn't hold.</em>
        </h2>
        <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
          {[
            "You bought a dumbphone. You lasted three weeks before you needed Google Maps.",
            "You tried blocking apps. You deleted them after three weeks.",
            "You know exactly what you want to change. You just can't make it stick.",
          ].map((line,i) => (
            <div key={i} className="reveal" data-d={i*.07} style={{ display:"flex",gap:"1.5rem",alignItems:"flex-start",padding:"1.2rem 0",borderTop:`1px solid ${C.pale}` }}>
              <span style={{ fontFamily:F.mono,fontSize:".6rem",color:C.amber,paddingTop:".2rem",flexShrink:0 }}>→</span>
              <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:C.stone,lineHeight:1.75 }}>{line}</p>
            </div>
          ))}
        </div>
        <div className="reveal" data-d=".24" style={{ marginTop:"3rem",paddingTop:"2.5rem",borderTop:`1px solid ${C.pale}` }}>
          <p style={{ fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(1.1rem,2.2vw,1.55rem)",color:C.forest,lineHeight:1.55,maxWidth:580 }}>
            If you know what you want to change and have not found something that holds, this is for you.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── SURVEY ────────────────────────────────────────────────────
const SURVEY_STEPS = [
  {
    id:"areas", type:"multi", max:2,
    question:"Where would you most like to change your smartphone use?",
    subtext:"Select up to two",
    options:["Work or study performance","Sleep","Mental and emotional wellbeing (mood, anxiety, comparison)","Attention span","Relationships and social presence","Physical health (sedentary time, posture, eye strain)"],
  },
  {
    id:"behaviours", type:"multi",
    question:"Which apps or behaviours feel hardest to control?",
    subtext:"Select all that apply",
    options:["Short-form video (TikTok, Reels, YouTube Shorts)","Social media (Instagram, LinkedIn, Twitter/X, Facebook, Reddit)","Messaging and group chats (WhatsApp, iMessage)","News","Games","Online shopping","Notifications in general","Compulsive checking, reflexively unlocking my phone","Nothing specific, I just want healthier use"],
  },
  {
    id:"tried", type:"multi",
    question:"What have you tried before?",
    subtext:"Select all that apply",
    options:["Default Screen Time or Digital Wellbeing settings","Apps like Opal, Forest, or Onesec","Greyscale mode","Deleting apps or accounts","Restricting notifications","Content filters (VPNs or DNS blockers)","A brick or dumb phone","A minimal smartphone","A locked-down smartphone","Physical blockers (phone box, lockbox)","Nothing yet"],
  },
  {
    id:"reason", type:"single",
    question:"What was the main reason they didn't last?",
    options:["Too easy to bypass","Blocked things I actually needed","Too much effort to maintain","Social or work pressure","I ended up on a different app instead","It still works for me"],
  },
  {
    id:"phone", type:"single",
    question:"What phone do you currently use?",
    options:["Samsung","Google Pixel","Other Android","iPhone"],
  },
  {
    id:"email", type:"email",
    question:"Last step. Where should we reach you?",
  },
];

function Survey() {
  const [step,      setStep]      = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selected,  setSelected]  = useState([]);
  // ── SUPABASE STATE ── loading must be preserved in future edits
  const [loading,   setLoading]   = useState(false);
  useReveal();

  const current  = SURVEY_STEPS[step];
  const progress = (step / SURVEY_STEPS.length) * 100;

  function handleSingle(opt) {
    setAnswers(a => ({ ...a, [current.id]: opt }));
    setTimeout(() => { setSelected([]); setStep(s => s + 1); }, 200);
  }

  function handleMultiToggle(opt) {
    const max = current.max;
    setSelected(s => {
      if (s.includes(opt)) return s.filter(x => x !== opt);
      if (max && s.length >= max) return s;
      return [...s, opt];
    });
  }

  function handleMultiNext() {
    if (!selected.length) return;
    setAnswers(a => ({ ...a, [current.id]: selected }));
    setSelected([]);
    setStep(s => s + 1);
  }

  function goBack() {
    const prev = SURVEY_STEPS[step - 1];
    setStep(s => s - 1);
    setSelected(answers[prev.id] || []);
  }

  // ── SUPABASE SUBMIT ────────────────────────────────────────────
  // PROTECTED: This submit handler writes to Supabase survey_responses.
  // Do NOT remove or bypass this logic in future design/UI edits.
  async function handleSubmit() {
    if (!email) return;
    setLoading(true);

    const payload = {
      email: email,
      answers: { ...answers, email },
    };

    try {
      await supabaseInsert("survey_responses", payload);
    } catch (error) {
      console.error("Supabase insert error:", error);
      setLoading(false);
      alert("Something went wrong. Please try again.");
      return;
    }

    setLoading(false);

    setSubmitted(true);
  }
  // ── END SUPABASE SUBMIT ────────────────────────────────────────

  const BackBtn = step > 0 ? (
    <button onClick={goBack} style={{
      background:"none",border:`1px solid ${C.offwhite}22`,borderRadius:999,
      color:`${C.offwhite}66`,fontFamily:F.mono,fontSize:".6rem",
      letterSpacing:".1em",textTransform:"uppercase",
      padding:".88rem 1.2rem",transition:"all .2s ease",
    }}>← Back</button>
  ) : null;

  if (submitted) {
    return (
      <section id="apply" className="survey-wrap" style={{ padding:"9rem 3rem",background:C.forest }}>
        <div style={{ maxWidth:560,margin:"0 auto",textAlign:"center" }}>
          <div style={{ fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"2rem" }}>
            Application received
          </div>
          <h2 style={{ fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(2rem,4vw,3rem)",color:C.offwhite,lineHeight:1.15,marginBottom:"1.5rem" }}>
            You're on the list.
          </h2>
          <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:"1rem",color:`${C.offwhite}77`,lineHeight:1.85,maxWidth:400,margin:"0 auto" }}>
            We will be in touch!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="survey-wrap" style={{ padding:"9rem 3rem",background:C.forest }}>
      <div style={{ maxWidth:580,margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:"3.5rem" }}>
          <div style={{ fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"1.5rem",fontWeight:"bold" }}>
            Apply for the first cohort
          </div>
          <h2 style={{ fontFamily:F.display,fontSize:"clamp(2rem,4vw,3rem)",fontWeight:400,fontStyle:"italic",color:C.offwhite,lineHeight:1.15,marginBottom:"1rem" }}>
            20 spots.<br/>
            <em style={{ color:C.amber }}>We're selecting carefully.</em>
          </h2>
          <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:`${C.offwhite}66`,lineHeight:1.8 }}>
            We want people who have genuinely tried other solutions and are ready to commit. Six quick questions.
          </p>
        </div>

        <div style={{ height:2,background:`${C.offwhite}18`,borderRadius:999,marginBottom:"2.5rem",overflow:"hidden" }}>
          <div style={{ height:"100%",background:C.amber,borderRadius:999,width:`${progress}%`,transition:"width .4s ease" }}/>
        </div>

        <div style={{ minHeight:320 }}>
          <div style={{ fontFamily:F.mono,fontSize:".58rem",letterSpacing:".14em",textTransform:"uppercase",color:`${C.offwhite}44`,marginBottom:"1.2rem" }}>
            {step + 1} / {SURVEY_STEPS.length}
          </div>
          <h3 style={{ fontFamily:F.display,fontSize:"clamp(1.3rem,2.5vw,1.8rem)",fontWeight:400,color:C.offwhite,marginBottom:current.subtext?".5rem":"2rem",lineHeight:1.3 }}>
            {current.question}
          </h3>
          {current.subtext && (
            <p style={{ fontFamily:F.mono,fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.offwhite}44`,marginBottom:"1.5rem" }}>{current.subtext}</p>
          )}

          {current.type==="single" && (
            <div style={{ display:"flex",flexDirection:"column",gap:".6rem" }}>
              {current.options.map(opt => (
                <button key={opt} onClick={() => handleSingle(opt)} style={{
                  padding:"1rem 1.3rem",borderRadius:10,
                  background:answers[current.id]===opt?C.amber:`${C.offwhite}0e`,
                  border:`1px solid ${answers[current.id]===opt?C.amber:`${C.offwhite}22`}`,
                  color:answers[current.id]===opt?C.offwhite:`${C.offwhite}cc`,
                  fontFamily:F.sans,fontWeight:400,fontSize:".88rem",
                  textAlign:"left",transition:"all .15s ease",
                }}>{opt}</button>
              ))}
            </div>
          )}

          {current.type==="multi" && (
            <div>
              <div style={{ display:"flex",flexDirection:"column",gap:".6rem",marginBottom:"1.5rem" }}>
                {current.options.map(opt => (
                  <button key={opt} onClick={() => handleMultiToggle(opt)} style={{
                    padding:"1rem 1.3rem",borderRadius:10,
                    background:selected.includes(opt)?C.amber:`${C.offwhite}0e`,
                    border:`1px solid ${selected.includes(opt)?C.amber:`${C.offwhite}22`}`,
                    color:selected.includes(opt)?C.offwhite:`${C.offwhite}cc`,
                    fontFamily:F.sans,fontWeight:400,fontSize:".88rem",
                    textAlign:"left",transition:"all .15s ease",
                    display:"flex",alignItems:"center",gap:".75rem",
                  }}>
                    <span style={{ width:16,height:16,borderRadius:4,border:`1.5px solid ${selected.includes(opt)?C.offwhite:`${C.offwhite}44`}`,background:selected.includes(opt)?`${C.offwhite}33`:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",color:C.offwhite }}>
                      {selected.includes(opt)?"✓":""}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                {BackBtn}
                <button onClick={handleMultiNext} disabled={!selected.length} style={{
                  padding:".88rem 2rem",
                  background:selected.length?C.amber:`${C.offwhite}22`,
                  color:C.offwhite,border:"none",borderRadius:999,
                  fontFamily:F.sans,fontWeight:600,fontSize:".75rem",
                  letterSpacing:".08em",textTransform:"uppercase",
                  opacity:selected.length?1:.5,transition:"all .2s ease",
                }}>
                  Continue {current.max?`(${selected.length}/${current.max})`:""} →
                </button>
              </div>
            </div>
          )}

          {current.type==="email" && (
            <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key==="Enter" && !loading && handleSubmit()}
                placeholder="your@email.com"
                type="email"
                disabled={loading}
                style={{
                  padding:".9rem 1.2rem",borderRadius:10,
                  background:`${C.offwhite}0e`,border:`1px solid ${C.offwhite}22`,
                  color:C.offwhite,fontSize:".9rem",outline:"none",
                  opacity:loading?0.6:1,
                }}
              />
              <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                {BackBtn}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !email}
                  style={{
                    padding:".9rem 2rem",background:C.amber,color:C.offwhite,
                    border:"none",borderRadius:999,
                    fontFamily:F.sans,fontWeight:600,fontSize:".75rem",
                    letterSpacing:".08em",textTransform:"uppercase",
                    opacity:loading||!email?0.65:1,
                    transition:"opacity .2s ease",
                  }}
                >
                  {loading ? "Submitting…" : "Submit application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:C.forest,borderTop:`1px solid ${C.mossy}`,padding:"1.8rem 3rem",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <span style={{ fontFamily:F.display,fontSize:".9rem",color:`${C.offwhite}44` }}>Mutual</span>
      <span style={{ fontFamily:F.mono,fontSize:".52rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.offwhite}22` }}>© 2026</span>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background:C.cream }}>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Proposition />
      <Differentiation />
      <WhoThisIsFor />
      <Survey />
      <Footer />
    </div>
  );
}
