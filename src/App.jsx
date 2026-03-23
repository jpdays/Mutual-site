import { useState, useEffect, useRef } from "react";

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

const APPS = [
  { id:"eve",       name:"Eve",       bg:"#1A2E22", fg:"#7A9E82", abbr:"Eve",  dock:false },
  { id:"instagram", name:"Instagram", bg:"#C13584", fg:"#fff",    abbr:"IG",   dock:false },
  { id:"pinterest", name:"Pinterest", bg:"#E60023", fg:"#fff",    abbr:"P",    dock:false },
  { id:"whatsapp",  name:"WhatsApp",  bg:"#25D366", fg:"#fff",    abbr:"WA",   dock:true  },
  { id:"news",      name:"News",      bg:"#1A73E8", fg:"#fff",    abbr:"News", dock:false },
  { id:"calendar",  name:"Calendar",  bg:"#fff",    fg:"#E53935", abbr:"17",   dock:false, border:true },
  { id:"chrome",    name:"Chrome",    bg:"#fff",    fg:"#4285F4", abbr:"Chr",  dock:true,  border:true },
  { id:"messages",  name:"Messages",  bg:"#34C759", fg:"#fff",    abbr:"Msg",  dock:true  },
  { id:"maps",      name:"Maps",      bg:"#fff",    fg:"#34A853", abbr:"Maps", dock:false, border:true },
  { id:"settings",  name:"Settings",  bg:"#E5E5EA", fg:"#3C3C43", abbr:"Set",  dock:true  },
  { id:"spotify",   name:"Spotify",   bg:"#191414", fg:"#1DB954", abbr:"Spt",  dock:false },
  { id:"mail",      name:"Mail",      bg:"#147EFB", fg:"#fff",    abbr:"Mail", dock:false },
];

const GRID_APPS = APPS.filter(a => !a.dock);
const DOCK_APPS = APPS.filter(a => a.dock);

const ANALYSIS = [
  { text:"Reviewing app usage — last 14 days...", kind:"head" },
  { text:"Instagram: 1h 42m average daily",       kind:"data" },
  { text:"Pinterest: 38m average daily",          kind:"data" },
  { text:"Google News: 29m average daily",        kind:"data" },
  { text:"WhatsApp: active throughout the day",   kind:"data" },
  { text:"",                                      kind:"gap"  },
  { text:"Cross-referencing with calendar...",    kind:"head" },
  { text:"Work hours identified: 9am – 6pm",      kind:"data" },
  { text:"High usage overlap detected during work hours", kind:"warn" },
  { text:"Notification interruptions: avg 47 per day",    kind:"warn" },
  { text:"Most frequent unlock trigger: Instagram",       kind:"warn" },
  { text:"",                                      kind:"gap"  },
  { text:"I think I know what's happening.",      kind:"end"  },
];

function AppIcon({ app, hidden, tapped }) {
  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",gap:3,
      opacity:hidden?0:1,
      transform:hidden?"scale(0.3)":tapped===app.id?"scale(0.88)":"scale(1)",
      transition:"all .5s cubic-bezier(.34,1.2,.64,1)",
    }}>
      <div style={{
        width:40,height:40,borderRadius:10,
        background:app.bg,
        border:app.border?"1px solid rgba(0,0,0,.12)":"none",
        boxShadow:"0 1px 5px rgba(0,0,0,.13)",
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        <span style={{
          fontSize:app.abbr.length>3?"8px":app.abbr.length>2?"9px":app.abbr.length===2?"12px":"16px",
          fontWeight:700,color:app.fg,
          fontFamily:app.id==="eve"?"Georgia,serif":"-apple-system,sans-serif",
          letterSpacing:"-0.2px",
        }}>{app.abbr}</span>
      </div>
      <span style={{
        fontFamily:"-apple-system,sans-serif",fontSize:"8.5px",
        color:"#1C1C1E",lineHeight:1,
        maxWidth:44,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center",
      }}>{app.name}</span>
    </div>
  );
}

function Bubble({ side, text }) {
  return (
    <div style={{
      display:"flex",justifyContent:side==="user"?"flex-end":"flex-start",
      alignItems:"flex-end",gap:5,
      animation:"fadeUp .28s ease both",flexShrink:0,
    }}>
      {side==="eve" && (
        <div style={{ width:24,height:24,borderRadius:"50%",flexShrink:0,background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2 }}>
          <span style={{ fontSize:"10px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
        </div>
      )}
      <div style={{
        maxWidth:"74%",padding:"8px 11px",
        borderRadius:side==="user"?"17px 17px 4px 17px":"17px 17px 17px 4px",
        background:side==="user"?"#007AFF":"#E9E9EB",
        boxShadow:"0 1px 2px rgba(0,0,0,.07)",
      }}>
        <span style={{
          fontFamily:"-apple-system,sans-serif",
          fontSize:"11.5px",fontWeight:400,
          color:side==="user"?"#fff":"#1C1C1E",
          lineHeight:1.42,display:"block",
        }}>{text}</span>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display:"flex",alignItems:"flex-end",gap:5,animation:"fadeUp .28s ease both",flexShrink:0 }}>
      <div style={{ width:24,height:24,borderRadius:"50%",flexShrink:0,background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:2 }}>
        <span style={{ fontSize:"10px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
      </div>
      <div style={{ padding:"10px 13px",borderRadius:"17px 17px 17px 4px",background:"#E9E9EB",display:"flex",gap:4,alignItems:"center" }}>
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
  const [notif,     setNotif]     = useState(null);
  const [grey,      setGrey]      = useState(false);
  const [mode,      setMode]      = useState("");
  const [clock,     setClock]     = useState("10:47");
  const [bq,        setBq]        = useState("");
  const [blocked,   setBlocked]   = useState(false);
  const [tapped,    setTapped]    = useState(null);
  const idRef = useRef(0);

  useEffect(() => {
    let dead = false;

    const addMsg = (side, text) => {
      if (dead) return;
      setMsgs(prev => [...prev, { id: ++idRef.current, side, text }]);
    };

    const typeIn = async (text, setter, ms = 38) => {
      let s = "";
      for (const ch of text) {
        if (dead) return;
        s += ch; setter(s);
        await _sleep(ms + Math.random() * 12);
      }
    };

    const eveReply = async (text, wait = 720) => {
      if (dead) return;
      setTyping(true);
      await _sleep(wait);
      if (dead) return;
      setTyping(false);
      addMsg("eve", text);
      await _sleep(200);
    };

    const userSend = async (text, ms = 40) => {
      if (dead) return;
      await typeIn(text, setInput, ms);
      if (dead) return;
      await _sleep(160);
      setInput("");
      addMsg("user", text);
      await _sleep(300);
    };

    const run = async () => {
      while (!dead) {
        // RESET
        setScreen("home"); setMsgs([]); setInput(""); setTyping(false);
        setAlines([]); setAnalysing(false); setHidden(new Set());
        setNotif(null); setGrey(false); setMode("");
        setClock("10:47"); setBq(""); setBlocked(false); setTapped(null);
        idRef.current = 0;

        await _sleep(1400); if (dead) return;

        // Tap Eve
        setTapped("eve"); await _sleep(160); setTapped(null); await _sleep(440);
        setScreen("eve"); await _sleep(460); if (dead) return;

        // User types opening message
        await userSend("I've been spending too much time on my phone and I need to change that.", 36);
        if (dead) return;

        // Eve replies
        await eveReply("Let me take a look at how you've been using it.", 700);
        if (dead) return;

        // Analysis
        await _sleep(460); if (dead) return;
        setAnalysing(true); setAlines([]);
        for (const line of ANALYSIS) {
          if (dead) return;
          await _sleep(line.kind==="gap"?440:line.kind==="end"?680:line.kind==="head"?400:295);
          if (dead) return;
          setAlines(prev => [...prev, line]);
        }
        await _sleep(1300); if (dead) return;
        setAnalysing(false);

        // Plan
        setAlines([]); setMsgs([]); await _sleep(260); if (dead) return;

        await eveReply("Based on your usage, I'd suggest blocking Instagram and Pinterest completely during work hours and keeping WhatsApp available. Want to go further?", 560);
        if (dead) return;
        await _sleep(1900);

        await userSend("Yes. Most notifications are distracting too. And make the phone less tempting to pick up.", 35);
        if (dead) return;

        await eveReply("Got it. I can silence all notifications during work hours except your boss and partner. And I can switch your phone to greyscale — less colour, less pull.", 900);
        if (dead) return;
        await _sleep(660);

        await eveReply("Let's try this for two weeks. I'll check in with you on the 14th to see if it's working. You can adjust anything before then.", 600);
        if (dead) return;
        await _sleep(1700);

        await userSend("Let's do it.", 44);
        if (dead) return;
        await _sleep(700);

        // Change
        setScreen("change"); await _sleep(820); if (dead) return;

        setHidden(new Set(["instagram","pinterest"])); await _sleep(1200); if (dead) return;

        setNotif(47);
        for (const n of [32, 18, 6, 2]) {
          await _sleep(360); if (dead) return; setNotif(n);
        }
        await _sleep(360); if (dead) return;

        setGrey(true); await _sleep(1400); if (dead) return;
        setMode("Work mode. Until 6pm."); await _sleep(1200); if (dead) return;

        // Time jump
        setClock("11:23"); await _sleep(680); if (dead) return;

        // Browser proof
        setScreen("browser"); setBq(""); setBlocked(false);
        await _sleep(620); if (dead) return;
        await typeIn("instagram", setBq, 55);
        if (dead) return;
        await _sleep(500);
        setBlocked(true);
        await _sleep(3600); if (dead) return;
        await _sleep(800);
      }
    };

    run();
    return () => { dead = true; };
  }, []);

  const tc = grey ? "#555" : "#1C1C1E";

  const StatusBar = (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 20px 4px",flexShrink:0,zIndex:5 }}>
      <span style={{ fontFamily:"-apple-system,sans-serif",fontSize:"13px",fontWeight:700,color:tc,letterSpacing:"-.2px" }}>{clock}</span>
      <div style={{ display:"flex",gap:5,alignItems:"center" }}>
        <div style={{ display:"flex",gap:2,alignItems:"flex-end",height:11 }}>
          {[4,6,8,11].map((h,i) => <div key={i} style={{ width:3,height:h,borderRadius:1.5,background:tc,opacity:i<3?1:.32 }}/>)}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:1 }}>
          <div style={{ width:22,height:11,borderRadius:3,border:`1.3px solid ${tc}`,opacity:.75,padding:"2px" }}>
            <div style={{ width:"76%",height:"100%",borderRadius:1.5,background:tc }}/>
          </div>
          <div style={{ width:2,height:5,borderRadius:"0 1px 1px 0",background:tc,opacity:.5 }}/>
        </div>
      </div>
    </div>
  );

  const HomeScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",padding:"4px 14px 0" }}>
      <div style={{ flex:1,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px 4px",alignContent:"start",paddingTop:4 }}>
        {GRID_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped}/>)}
      </div>
      <div style={{ borderTop:"1px solid rgba(0,0,0,.06)",padding:"8px 6px 6px",display:"flex",justifyContent:"space-around" }}>
        {DOCK_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped}/>)}
      </div>
    </div>
  );

  const EveScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <div style={{ padding:"5px 14px 7px",flexShrink:0,borderBottom:"1px solid rgba(0,0,0,.07)",background:"#F9F9F9",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:30,height:30,borderRadius:"50%",background:"#1A2E22",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:"11px",fontWeight:700,color:"#7A9E82",fontFamily:"Georgia,serif" }}>E</span>
        </div>
        <div>
          <div style={{ fontFamily:"-apple-system,sans-serif",fontWeight:600,fontSize:"13px",color:"#1C1C1E" }}>Eve</div>
          <div style={{ fontFamily:"-apple-system,sans-serif",fontSize:"10px",color:analysing?"#FF9500":"#34C759" }}>
            {analysing?"Analysing…":"Active now"}
          </div>
        </div>
        {analysing && (
          <div style={{ marginLeft:"auto",display:"flex",gap:3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:4,height:4,borderRadius:"50%",background:"#FF9500",animation:`fadeUp .7s ${i*.2}s ease infinite alternate` }}/>)}
          </div>
        )}
      </div>
      <div style={{ flex:1,overflow:"hidden",position:"relative" }}>
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          display:"flex",flexDirection:"column",
          padding:analysing?"10px 14px":"8px 12px",
          gap:analysing?2:8,
        }}>
          {analysing ? (
            alines.slice(-15).map((l, i) => (
              l.kind==="gap" ? (
                <div key={i} style={{ height:5 }}/>
              ) : (
                <div key={i} style={{
                  fontFamily:"ui-monospace,'SF Mono',Menlo,monospace",
                  fontSize:l.kind==="end"?"11px":"10px",
                  lineHeight:1.52,
                  color:l.kind==="end"?"#1C1C1E":l.kind==="warn"?"#E53935":l.kind==="head"?"#8E8E93":"#3C3C43",
                  fontWeight:l.kind==="end"?600:400,
                  paddingLeft:(l.kind==="data"||l.kind==="warn")?10:0,
                  animation:"fadeUp .22s ease both",
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
        <div style={{ padding:"5px 10px 8px",flexShrink:0,borderTop:"1px solid rgba(0,0,0,.07)",background:"#F9F9F9",display:"flex",alignItems:"center",gap:6 }}>
          <div style={{
            flex:1,background:"#fff",border:"1px solid #D1D1D6",borderRadius:18,
            padding:"6px 12px",minHeight:29,
            fontFamily:"-apple-system,sans-serif",fontSize:"11px",
            color:input?"#1C1C1E":"#C7C7CC",
            display:"flex",alignItems:"center",lineHeight:1.4,
          }}>
            <span style={{ flex:1 }}>{input||"Message Eve…"}</span>
            {input && <span style={{ display:"inline-block",width:1.5,height:"0.85em",background:"#007AFF",marginLeft:1,animation:"blink 1s step-end infinite" }}/>}
          </div>
          <div style={{
            width:28,height:28,borderRadius:"50%",flexShrink:0,
            background:input?"#007AFF":"#E9E9EB",
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
    <div style={{ flex:1,display:"flex",flexDirection:"column",padding:"0 14px" }}>
      {mode && (
        <div style={{ padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.05)",marginBottom:4,flexShrink:0,animation:"fadeUp .4s ease both" }}>
          <span style={{ fontFamily:"-apple-system,sans-serif",fontSize:"10px",fontWeight:600,color:grey?"#3C3C43":"#2E7D32" }}>{mode}</span>
        </div>
      )}
      <div style={{ flex:1,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px 4px",alignContent:"start",paddingTop:4 }}>
        {GRID_APPS.map(a => <AppIcon key={a.id} app={a} hidden={hidden.has(a.id)} tapped={tapped}/>)}
      </div>
      {notif !== null && (
        <div style={{ padding:"5px 2px",borderTop:"1px solid rgba(0,0,0,.05)",display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
          <span style={{ fontFamily:"-apple-system,sans-serif",fontSize:"9px",color:"#8E8E93",flex:1 }}>Notifications today</span>
          <div style={{
            background:notif>10?"#FF3B30":notif>3?"#FF9500":"#34C759",
            borderRadius:8,padding:"1px 7px",
            fontFamily:"-apple-system,sans-serif",fontSize:"10px",fontWeight:700,color:"#fff",
            transition:"all .3s ease",minWidth:24,textAlign:"center",
          }}>{notif}</div>
        </div>
      )}
      <div style={{ borderTop:"1px solid rgba(0,0,0,.06)",padding:"7px 6px 6px",display:"flex",justifyContent:"space-around",flexShrink:0 }}>
        {DOCK_APPS.map(a => <AppIcon key={a.id} app={a} hidden={false} tapped={tapped}/>)}
      </div>
    </div>
  );

  const BrowserScreen = (
    <div style={{ flex:1,display:"flex",flexDirection:"column" }}>
      <div style={{ padding:"5px 12px 8px",flexShrink:0,borderBottom:"1px solid rgba(0,0,0,.07)",background:"#F9F9F9" }}>
        <div style={{ background:"#E5E5EA",borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:6 }}>
          <div style={{ width:9,height:9,borderRadius:"50%",background:"#8E8E93",opacity:.6,flexShrink:0 }}/>
          <span style={{ fontFamily:"-apple-system,sans-serif",fontSize:"11px",color:"#1C1C1E",flex:1 }}>
            {bq || <span style={{ color:"#8E8E93" }}>Search or website name</span>}
            {bq && !blocked && <span style={{ display:"inline-block",width:1.5,height:"0.85em",background:"#007AFF",marginLeft:1,animation:"blink 1s step-end infinite" }}/>}
          </span>
        </div>
      </div>
      {blocked ? (
        <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,gap:14,animation:"fadeUp .4s ease both" }}>
          <div style={{ width:50,height:50,borderRadius:14,background:"#F2F2F7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px" }}>🔒</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"-apple-system,sans-serif",fontWeight:600,fontSize:"14px",color:"#1C1C1E",marginBottom:6,lineHeight:1.3 }}>Instagram is off until 6pm.</div>
            <div style={{ fontFamily:"-apple-system,sans-serif",fontSize:"12px",color:"#8E8E93",lineHeight:1.5 }}>Enjoy the focus.</div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1,padding:12,display:"flex",flexDirection:"column",gap:8 }}>
          {[72,55,88,42,65].map((w,i) => <div key={i} style={{ height:9,background:"#F2F2F7",borderRadius:4,width:`${w}%` }}/>)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      width:262,height:524,flexShrink:0,
      background:"#1C1C1E",borderRadius:46,padding:"8px 5px",
      boxShadow:"0 2px 0 #000,inset 0 0 0 1px rgba(255,255,255,.11),0 24px 64px rgba(0,0,0,.4)",
      position:"relative",
    }}>
      <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:94,height:26,background:"#1C1C1E",borderRadius:"0 0 18px 18px",zIndex:10 }}/>
      <div style={{
        width:"100%",height:"100%",background:"#fff",borderRadius:40,
        overflow:"hidden",display:"flex",flexDirection:"column",
        filter:grey?"saturate(0.06) brightness(0.95)":"none",
        transition:"filter 1.45s ease",
      }}>
        {StatusBar}
        <div style={{ flex:1,overflow:"hidden",display:"flex",flexDirection:"column" }}>
          {screen==="home"    && HomeScreen}
          {screen==="eve"     && EveScreen}
          {screen==="change"  && ChangeScreen}
          {screen==="browser" && BrowserScreen}
        </div>
        <div style={{ height:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <div style={{ width:100,height:4,borderRadius:2,background:"#1C1C1E",opacity:.18 }}/>
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
          <h2 style={{ fontFamily:F.display,fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:400,lineHeight:1.15,color:C.forest }}>
            See how it works.<br/>
            <em style={{ fontStyle:"italic",color:C.amber }}>In your own words.</em>
          </h2>
        </div>
        <div className="reveal demo-layout" data-d=".1" style={{ display:"flex",gap:"3.5rem",alignItems:"flex-start",flexWrap:"wrap" }}>
          <EveDemo/>
          <div style={{ flex:1,minWidth:220,paddingTop:"1.5rem" }}>
            <div style={{ display:"flex",flexDirection:"column",gap:"1.8rem" }}>
              {[
                { n:"01",title:"Just tell Eve.",body:"No forms. No settings. Eve listens in plain language, then gets to work." },
                { n:"02",title:"It already knows your patterns.",body:"Before it says anything, Eve reads your usage. The plan is built on evidence, not guesswork." },
                { n:"03",title:"Eve recommends. You decide.",body:"A considered position, not a menu. You adjust, confirm, and it's set for two weeks." },
                { n:"04",title:"The phone actually changes.",body:"Apps disappear. Colour drains. The browser blocks. Not a notification — the phone keeps its word." },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex",gap:".75rem" }}>
                  <span style={{ fontFamily:F.mono,fontSize:".6rem",color:C.sage,fontWeight:"bold",paddingTop:".2rem",flexShrink:0 }}>{item.n}</span>
                  <div>
                    <div style={{ fontFamily:F.display,fontWeight:500,fontSize:"1rem",color:C.forest,marginBottom:".35rem" }}>{item.title}</div>
                    <p style={{ fontFamily:F.sans,fontWeight:300,fontSize:".85rem",color:C.stone,lineHeight:1.75 }}>{item.body}</p>
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

  function handleSubmit() {
    if (!email) return;
    setSubmitted(true);
  }

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
            We're reviewing applications and will be in touch if you're selected for the first cohort. We'll reach out via email within two weeks.
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
                onKeyDown={e => e.key==="Enter" && handleSubmit()}
                placeholder="your@email.com"
                type="email"
                style={{
                  padding:".9rem 1.2rem",borderRadius:10,
                  background:`${C.offwhite}0e`,border:`1px solid ${C.offwhite}22`,
                  color:C.offwhite,fontSize:".9rem",outline:"none",
                }}
              />
              <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                {BackBtn}
                <button onClick={handleSubmit} style={{
                  padding:".9rem 2rem",background:C.amber,color:C.offwhite,
                  border:"none",borderRadius:999,
                  fontFamily:F.sans,fontWeight:600,fontSize:".75rem",
                  letterSpacing:".08em",textTransform:"uppercase",
                }}>
                  Submit application
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

