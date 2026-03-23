
import { useState, useEffect, useRef } from "react";
import React from "react";

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
  display: '"EB Garamond", serif',
  sans:    '"Outfit", sans-serif',
  mono:    '"DM Mono", monospace',
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
      body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.028;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")}
      @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .reveal{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.25,.46,.45,.94),transform .8s cubic-bezier(.25,.46,.45,.94)}
      .reveal.on{opacity:1;transform:none}
      ::-webkit-scrollbar{width:2px}
      ::-webkit-scrollbar-thumb{background:${C.pale}}
      ::selection{background:${C.amber}33}
      input,select,textarea{font-family:${F.sans}}
      button{font-family:${F.sans};cursor:pointer}

      /* ── RESPONSIVE ── */

      /* Tablet and below */
      @media(max-width:768px){
        .section-pad{padding:5rem 1.5rem !important}
        .hero-pad{padding:6rem 1.5rem 4rem !important}
        .two-col{grid-template-columns:1fr !important}
        .nav-links{display:none !important}
        .nav-center{font-size:.52rem !important;padding:.25rem .6rem !important}
        .feature-grid{grid-template-columns:1fr !important}
        .survey-wrap{padding:5rem 1.5rem !important}
      }

      /* Mobile */
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
      padding:"1.1rem 1.5rem",display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",
      background:scrolled?`${C.cream}f2`:"transparent",
      backdropFilter:scrolled?"blur(18px)":"none",
      borderBottom:scrolled?`1px solid ${C.pale}`:"none",
      transition:"all .4s ease",
    }}>
      <span style={{fontFamily:F.display,fontSize:"1.1rem",fontWeight:500,color:scrolled?C.forest:C.offwhite,transition:"color .4s ease"}}>
        Mutual
      </span>
      <a href="#apply" className="nav-center" style={{
        fontFamily:F.sans,fontWeight:500,fontSize:".65rem",letterSpacing:".08em",
        textTransform:"uppercase",color:C.offwhite,
        padding:".45rem 1.1rem",background:C.amber,borderRadius:999,
        textDecoration:"none",justifySelf:"center",whiteSpace:"nowrap",
      }}>
        Join the first cohort
      </a>
      <div className="nav-links" style={{justifySelf:"end",display:"flex",gap:"1.5rem",alignItems:"center"}}>
        {["FAQ","About"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            fontFamily:F.sans,fontWeight:400,fontSize:".75rem",
            color:scrolled?`${C.forest}99`:`${C.offwhite}bb`,
            textDecoration:"none",transition:"color .3s ease",
          }}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

// ── PARTICLE CANVAS ───────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = React.useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const COUNT = Math.floor((W * H) / 14000);
    const particles = Array.from({length: COUNT}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * .001;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          const maxD = 110;
          if (d < maxD) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(184,114,58,${(.22 - d/maxD*.22)})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W+10;
        if (p.x > W+10) p.x = -10;
        if (p.y < -10) p.y = H+10;
        if (p.y > H+10) p.y = -10;
        const pulse = Math.sin(t * .8 + p.phase) * .4 + .8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI*2);
        ctx.fillStyle = `rgba(122,158,130,.55)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse + 1.5, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(122,158,130,.15)`;
        ctx.lineWidth = .8;
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1}}/>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero-pad" style={{
      minHeight:"100dvh",display:"flex",flexDirection:"column",justifyContent:"flex-end",
      padding:"8rem 3.5rem 5.5rem",
      position:"relative",overflow:"hidden",
    }}>
      {/* Background */}
      <div style={{position:"absolute",inset:0,zIndex:0,background:C.forest}}/>
      {/* Particle canvas */}
      <ParticleCanvas />
      {/* Gradient overlay — keeps text readable */}
      <div style={{
        position:"absolute",inset:0,zIndex:2,
        background:`linear-gradient(to top, rgba(36,48,40,.97) 20%, rgba(36,48,40,.75) 55%, rgba(36,48,40,.4) 100%)`,
      }}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.amber},${C.sage})`,zIndex:3}}/>

      <div style={{position:"relative",zIndex:4,maxWidth:860}}>
        <h1 style={{
          fontFamily:F.display,
          fontSize:"clamp(3.2rem,9vw,8.5rem)",
          fontWeight:400,lineHeight:.96,color:C.offwhite,
          letterSpacing:"-.01em",marginBottom:"2rem",
          animation:"fadeUp .9s .15s ease both",
        }}>
          <em style={{color:C.amber,fontStyle:"italic"}}>Your</em> phone.<br/>
          <em style={{color:C.amber,fontStyle:"italic"}}>Your</em> rules.
        </h1>
        <p style={{
          fontFamily:F.sans,fontWeight:300,
          fontSize:"clamp(.9rem,1.5vw,1.05rem)",
          lineHeight:1.85,color:`${C.offwhite}99`,
          maxWidth:520,
          animation:"fadeUp .9s .3s ease both",
        }}>
          We create mutually beneficial technology. A smartphone that keeps everything you need and removes only what you ask it to.
        </p>
      </div>
    </section>
  );
}

// ── PROPOSITION ───────────────────────────────────────────────
function Proposition() {
  useReveal();
  return (
    <section className="section-pad" style={{padding:"8rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div className="reveal" style={{fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"3rem",fontWeight:"bold"}}>
          How it works
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {
              n:"00",
              title:"Apply and tell us about your phone",
              body:"If you have a spare Samsung or Google Pixel, we may be able to work with it. If not, we can arrange a phone for you.",
            },
            {
              n:"01",
              title:"You tell us your rules",
              body:"Block apps completely or set daily time limits. Silence notifications during work hours. Filter specific websites and content. Switch to greyscale after 9pm. Whatever you want to change, write it down.",
            },
            {
              n:"02",
              title:"We configure your phone",
              body:"We set it up at the system level. Not an app you can delete. Not a setting you can toggle off. The rules are set at a level your future self cannot easily undo.",
            },
            {
              n:"03",
              title:"You live with it",
              body:"That's it. We check in. If the rules are not working, we adjust them. You are in control of what the rules are.",
            },
          ].map((s,i) => (
            <div key={i} className="reveal" data-d={i*.1} style={{
              display:"grid",gridTemplateColumns:"2.5rem 1fr",
              gap:".75rem",padding:"2.5rem 0",
              borderTop:`1px solid ${C.pale}`,
            }}>
              <span style={{fontFamily:F.mono,fontSize:".72rem",color:C.stone,paddingTop:".35rem",fontWeight:"bold"}}>{s.n}</span>
              <div>
                <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1.4rem",color:C.forest,marginBottom:".65rem"}}>{s.title}</div>
                <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:C.stone,lineHeight:1.85}}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" data-d=".3" style={{marginTop:"3.5rem",padding:"2rem 2.5rem",background:C.forest,borderRadius:16}}>
          <p style={{fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(1.1rem,2.2vw,1.5rem)",color:C.offwhite,lineHeight:1.6}}>
            You decide how you use your phone. We make it stick.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── EVE DEMO — four scenes ────────────────────────────────────

// Shared phone shell
function PhoneShell({ children, greyscale = false }) {
  return (
    <div style={{
      width: 200, minHeight: 380,
      background: greyscale ? "#2a2a2a" : C.forest,
      borderRadius: 28,
      border: `1px solid ${greyscale ? "#444" : C.mossy}`,
      overflow: "hidden",
      boxShadow: `0 20px 60px ${C.forest}44`,
      flexShrink: 0,
      filter: greyscale ? "saturate(0.1)" : "none",
      transition: "filter 1.2s ease",
      display: "flex", flexDirection: "column",
    }}>
      {/* Status bar */}
      <div style={{ padding: "10px 16px 6px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F.mono, fontSize: ".5rem", color: `${C.offwhite}66` }}>10:47</span>
        <div style={{ display: "flex", gap: 3 }}>
          {[1,1,1].map((_,i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: `${C.offwhite}44` }}/>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 12px 14px", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

// Scene 1 — The opening
function Scene1() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delays = [800, 1800, 3000];
    const timers = delays.map((d, i) => setTimeout(() => setStep(i + 1), d));
    const reset = setTimeout(() => setStep(0), 6000);
    return () => { timers.forEach(clearTimeout); clearTimeout(reset); };
  }, [step === 0 ? undefined : null]);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <PhoneShell>
        {/* Normal home screen icons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12, marginTop: 4 }}>
          {["📸","🎵","📧","🗺","🛒","📰","💬","⚙"].map((icon, i) => (
            <div key={i} style={{ aspectRatio: "1", background: `${C.offwhite}12`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem" }}>
              {icon}
            </div>
          ))}
        </div>
        {/* Chat input area */}
        <div style={{ marginTop: "auto" }}>
          {step >= 1 && (
            <div style={{ background: `${C.offwhite}14`, borderRadius: 12, padding: "8px 10px", marginBottom: 6, border: `1px solid ${C.offwhite}22`, animation: "fadeUp .4s ease both" }}>
              <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 4 }}>EVE</div>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".62rem", color: `${C.offwhite}88`, lineHeight: 1.5 }}>Hi. What's on your mind?</div>
            </div>
          )}
          {step >= 2 && (
            <div style={{ background: C.amber, borderRadius: 12, padding: "8px 10px", marginBottom: 6, animation: "fadeUp .4s ease both" }}>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".62rem", color: C.offwhite, lineHeight: 1.5 }}>I've been spending too much time on my phone and I need to change that.</div>
            </div>
          )}
          {step >= 3 && (
            <div style={{ background: `${C.offwhite}14`, borderRadius: 12, padding: "8px 10px", border: `1px solid ${C.offwhite}22`, animation: "fadeUp .4s ease both" }}>
              <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 4 }}>EVE</div>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".62rem", color: `${C.offwhite}88`, lineHeight: 1.5 }}>Let me take a look at how you've been using it.</div>
            </div>
          )}
        </div>
      </PhoneShell>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: C.sage, marginBottom: ".5rem" }}>01 — The opening</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: "1.2rem", color: C.forest, marginBottom: ".75rem" }}>Just tell Eve what you want.</div>
        <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".88rem", color: C.stone, lineHeight: 1.8 }}>No forms. No settings. No selecting from a list of options. Eve listens, then gets to work.</p>
      </div>
    </div>
  );
}

// Scene 2 — Eve analyses
const ANALYSIS_LINES = [
  "Reviewing app usage — last 14 days...",
  "Instagram: 1h 42m average daily",
  "Pinterest: 38m average daily",
  "Google News: 29m average daily",
  "WhatsApp: active throughout the day",
  "Cross-referencing with calendar...",
  "Work hours: 9am – 6pm",
  "High usage overlap during work hours detected",
  "Notification interruptions: avg 47 per day",
  "Most frequent unlock trigger: Instagram",
  "",
  "I think I know what's happening.",
];

function Scene2() {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setLines([]); setDone(false);
    let i = 0;
    const addLine = () => {
      if (i < ANALYSIS_LINES.length) {
        const l = ANALYSIS_LINES[i];
        setLines(prev => [...prev, l]);
        i++;
        if (i < ANALYSIS_LINES.length) setTimeout(addLine, l === "" ? 600 : l.startsWith("I think") ? 900 : 280);
        else { setTimeout(() => setDone(true), 400); setTimeout(() => { setLines([]); setDone(false); }, 6000); }
      }
    };
    const t = setTimeout(addLine, 400);
    return () => clearTimeout(t);
  }, [done === false && lines.length === 0 ? undefined : null]);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <PhoneShell>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 2, paddingTop: 4 }}>
          <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 6 }}>EVE — ANALYSING</div>
          {lines.map((l, i) => (
            <div key={i} style={{
              fontFamily: F.mono,
              fontSize: ".5rem",
              color: l.startsWith("I think") ? C.offwhite : l.startsWith("High") || l.startsWith("Most") ? `${C.amber}cc` : `${C.offwhite}55`,
              lineHeight: 1.6,
              animation: "fadeUp .25s ease both",
              fontWeight: l.startsWith("I think") ? 400 : 300,
              paddingTop: l === "" ? 4 : 0,
            }}>{l || " "}</div>
          ))}
          {!done && lines.length > 0 && (
            <span style={{ fontFamily: F.mono, fontSize: ".5rem", color: C.amber, animation: "fadeUp .3s ease infinite alternate" }}>█</span>
          )}
        </div>
      </PhoneShell>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: C.sage, marginBottom: ".5rem" }}>02 — Eve analyses</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: "1.2rem", color: C.forest, marginBottom: ".75rem" }}>It already knows your patterns.</div>
        <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".88rem", color: C.stone, lineHeight: 1.8 }}>Eve reads your usage data before it says anything. When the plan arrives, it's built on evidence — not guesswork.</p>
      </div>
    </div>
  );
}

// Scene 3 — The plan
const PLAN_MSGS = [
  { side: "eve", text: "Based on your usage, I'd suggest blocking Instagram and Pinterest completely during work hours and keeping WhatsApp available. Want to go further?" },
  { side: "user", text: "Yes. Notifications are distracting too. And make the phone less tempting." },
  { side: "eve", text: "I can silence all notifications during work hours except your boss and partner. And switch your phone to greyscale — less colour, less pull." },
  { side: "eve", text: "Let's try this for two weeks. I'll check in with you on the 14th. You can adjust anything before then." },
  { side: "user", text: "Let's do it." },
];

function Scene3() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (shown >= PLAN_MSGS.length) { setTimeout(() => setShown(0), 4000); return; }
    const m = PLAN_MSGS[shown];
    if (m.side === "eve") {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setShown(n => n + 1); }, m.text.length * 18 + 400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShown(n => n + 1), 900);
      return () => clearTimeout(t);
    }
  }, [shown]);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <PhoneShell>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, justifyContent: "flex-end" }}>
          {PLAN_MSGS.slice(0, shown).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.side === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease both" }}>
              <div style={{
                maxWidth: "88%", padding: "6px 9px", borderRadius: 10,
                background: m.side === "user" ? C.amber : `${C.offwhite}14`,
                border: `1px solid ${m.side === "user" ? C.amber : `${C.offwhite}18`}`,
              }}>
                {m.side === "eve" && <div style={{ fontFamily: F.mono, fontSize: ".45rem", color: C.amber, letterSpacing: ".1em", marginBottom: 3 }}>EVE</div>}
                <span style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".58rem", color: m.side === "user" ? C.offwhite : `${C.offwhite}88`, lineHeight: 1.55 }}>{m.text}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "6px 9px", borderRadius: 10, background: `${C.offwhite}14`, border: `1px solid ${C.offwhite}18`, display: "flex", gap: 3 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${C.offwhite}55`, animation: `fadeUp .5s ${i*.14}s ease infinite alternate` }}/>)}
              </div>
            </div>
          )}
        </div>
      </PhoneShell>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: C.sage, marginBottom: ".5rem" }}>03 — The plan</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: "1.2rem", color: C.forest, marginBottom: ".75rem" }}>Eve recommends. You decide.</div>
        <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".88rem", color: C.stone, lineHeight: 1.8 }}>Not a menu of options. A considered recommendation, built on your data. You adjust, confirm, and it's set for two weeks.</p>
      </div>
    </div>
  );
}

// Scene 4 — The change
function Scene4() {
  const [phase, setPhase] = useState(0);
  // 0: before, 1: implementing, 2: greyscale done, 3: block screen
  useEffect(() => {
    const seq = [0, 1800, 3800, 6000, 9500];
    const timers = seq.map((d, i) => setTimeout(() => setPhase(i), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const isGrey = phase >= 2;
  const apps = [
    { name: "Maps",      visible: true },
    { name: "WhatsApp",  visible: true },
    { name: "Calendar",  visible: true },
    { name: "Mail",      visible: true },
    { name: "Instagram", visible: phase < 1 },
    { name: "Pinterest", visible: phase < 1 },
    { name: "News",      visible: true },
    { name: "Spotify",   visible: true },
  ];

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <PhoneShell greyscale={isGrey}>
        {phase < 3 ? (
          <>
            <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: isGrey ? "#aaa" : C.amber, letterSpacing: ".1em", marginBottom: 8 }}>
              {phase === 0 ? "HOME" : phase === 1 ? "EVE — CONFIGURING..." : "WORK MODE · UNTIL 6PM"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
              {apps.map(app => (
                <div key={app.name} style={{
                  aspectRatio: "1", borderRadius: 10,
                  background: app.visible ? `${C.offwhite}${isGrey ? "18" : "14"}` : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .6s cubic-bezier(.34,1.56,.64,1)",
                  transform: app.visible ? "scale(1)" : "scale(0)",
                  opacity: app.visible ? 1 : 0,
                }}>
                  {app.visible && <span style={{ fontFamily: F.mono, fontSize: ".48rem", color: isGrey ? "#888" : `${C.offwhite}88` }}>{app.name.slice(0,3)}</span>}
                </div>
              ))}
            </div>
            {phase >= 2 && (
              <div style={{ marginTop: "auto", background: `${C.offwhite}12`, borderRadius: 10, padding: "8px 10px", border: `1px solid ${C.offwhite}18`, animation: "fadeUp .5s ease both" }}>
                <div style={{ fontFamily: F.mono, fontSize: ".45rem", color: "#aaa", letterSpacing: ".1em", marginBottom: 3 }}>EVE</div>
                <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".55rem", color: "#aaa", lineHeight: 1.5 }}>All set. I'll check in on the 14th. Good luck.</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: "#888", letterSpacing: ".1em", marginBottom: 12 }}>INSTAGRAM.COM</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#333", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: "1.1rem", filter: "saturate(0)" }}>📸</div>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: ".65rem", color: "#ccc", marginBottom: 6, lineHeight: 1.4 }}>Instagram is off until 6pm.</div>
            <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".58rem", color: "#888", lineHeight: 1.5 }}>Enjoy the focus.</div>
          </div>
        )}
      </PhoneShell>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: C.sage, marginBottom: ".5rem" }}>04 — The change</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: "1.2rem", color: C.forest, marginBottom: ".75rem" }}>The phone actually changes.</div>
        <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".88rem", color: C.stone, lineHeight: 1.8 }}>Apps disappear. Colour drains. The browser blocks. Not a notification. Not a reminder. The phone keeps its word.</p>
      </div>
    </div>
  );
}

// ── EVE DEMO SECTION ─────────────────────────────────────────
function Differentiation() {
  useReveal();
  return (
    <section className="section-pad" style={{ padding: "7rem 3rem", background: C.cream, borderTop: `1px solid ${C.pale}` }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "4rem" }}>
          <div style={{ fontFamily: F.mono, fontSize: ".72rem", letterSpacing: ".2em", textTransform: "uppercase", color: C.sage, marginBottom: ".75rem", fontWeight: "bold" }}>Meet Eve</div>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.15, color: C.forest }}>
            See how it works.<br/>
            <em style={{ fontStyle: "italic", color: C.amber }}>In your own words.</em>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          <div className="reveal" data-d=".05"><Scene1 /></div>
          <div className="reveal" data-d=".1"><Scene2 /></div>
          <div className="reveal" data-d=".15"><Scene3 /></div>
          <div className="reveal" data-d=".2"><Scene4 /></div>
        </div>
      </div>
    </section>
  );
}

// ── WHO THIS IS FOR ───────────────────────────────────────────
function WhoThisIsFor() {
  useReveal();
  return (
    <section className="section-pad" style={{padding:"7rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div className="reveal" style={{fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"3rem",fontWeight:"bold"}}>
          Who this is for
        </div>
        <h2 className="reveal" style={{fontFamily:F.display,fontSize:"clamp(1.9rem,3.5vw,2.8rem)",fontWeight:400,lineHeight:1.2,color:C.forest,marginBottom:"3rem"}}>
          You've tried the other solutions.<br/>
          <em style={{fontStyle:"italic",color:C.amber}}>They didn't hold.</em>
        </h2>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            "You bought a dumbphone. You lasted three weeks before you needed Google Maps.",
            "You tried blocking apps. You deleted them after three weeks.",
            "You know exactly what you want to change. You just can't make it stick.",
          ].map((line,i) => (
            <div key={i} className="reveal" data-d={i*.07} style={{
              display:"flex",gap:"1.5rem",alignItems:"flex-start",
              padding:"1.2rem 0",borderTop:`1px solid ${C.pale}`,
            }}>
              <span style={{fontFamily:F.mono,fontSize:".6rem",color:C.amber,paddingTop:".2rem",flexShrink:0}}>→</span>
              <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:C.stone,lineHeight:1.75}}>{line}</p>
            </div>
          ))}
        </div>
        <div className="reveal" data-d=".24" style={{marginTop:"3rem",paddingTop:"2.5rem",borderTop:`1px solid ${C.pale}`}}>
          <p style={{fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(1.1rem,2.2vw,1.55rem)",color:C.forest,lineHeight:1.55,maxWidth:580}}>
            If you know what you want to change and have not found something that holds, this is for you.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── SURVEY / APPLICATION ──────────────────────────────────────
const SURVEY_STEPS = [
  {
    id:"areas",
    question:"Where would you most like to change your smartphone use?",
    subtext:"Select up to two",
    type:"multi",
    max:2,
    options:[
      "Work or study performance",
      "Sleep",
      "Mental and emotional wellbeing (mood, anxiety, comparison)",
      "Attention span",
      "Relationships and social presence",
      "Physical health (sedentary time, posture, eye strain)",
    ],
  },
  {
    id:"behaviours",
    question:"Which apps or behaviours feel hardest to control?",
    subtext:"Select all that apply",
    type:"multi",
    options:[
      "Short-form video (TikTok, Reels, YouTube Shorts)",
      "Social media (Instagram, LinkedIn, Twitter/X, Facebook, Reddit)",
      "Messaging and group chats (WhatsApp, iMessage)",
      "News",
      "Games",
      "Online shopping",
      "Notifications in general",
      "Compulsive checking, reflexively unlocking my phone",
      "Nothing specific, I just want healthier use",
    ],
  },
  {
    id:"tried",
    question:"What have you tried before?",
    subtext:"Select all that apply",
    type:"multi",
    options:[
      "Default Screen Time or Digital Wellbeing settings",
      "Apps (Opal, Forest, Onesec, others)",
      "Grayscale mode",
      "Deleting apps or accounts",
      "Restricting notifications",
      "Content filters (VPNs, DNS)",
      "Brick or dumb phone (Nokia, Punkt, others)",
      "Minimal smartphone (Light Phone, others)",
      "Locked-down smartphone (Balance, Wisephone, SLEKE)",
      "Physical blockers (Brick, Bloc, Unplug, lockbox)",
      "Nothing yet",
    ],
  },
  {
    id:"why_failed",
    question:"What was the main reason they didn't last?",
    type:"single",
    options:[
      "Too easy to bypass or uninstall",
      "Blocked things I actually needed",
      "Too much effort to set up or maintain",
      "Social or work pressure made it impractical",
      "I moved to different apps and spent the same time there",
      "They still work, this is no longer a problem for me",
    ],
  },
  {
    id:"phone",
    question:"What phone do you currently use?",
    type:"single",
    options:["Samsung","Google Pixel","Other Android","iPhone"],
  },
  {
    id:"email",
    question:"Last step. Where should we reach you?",
    type:"email",
  },
];

function Survey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState([]);
  useReveal();

  const current = SURVEY_STEPS[step];
  const progress = (step / SURVEY_STEPS.length) * 100;

  function handleSingle(opt) {
    setAnswers(a => ({...a, [current.id]: opt}));
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
    setAnswers(a => ({...a, [current.id]: selected}));
    setSelected([]);
    setStep(s => s + 1);
  }

  function handleSubmit() {
    if (!email.includes("@")) return;
    setAnswers(a => ({...a, email}));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="apply" className="survey-wrap" style={{padding:"9rem 3rem",background:C.forest}}>
        <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"2rem"}}>
            Application received
          </div>
          <h2 style={{fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(2rem,4vw,3rem)",color:C.offwhite,lineHeight:1.15,marginBottom:"1.5rem"}}>
            You're on the list.
          </h2>
          <p style={{fontFamily:F.sans,fontWeight:300,fontSize:"1rem",color:`${C.offwhite}77`,lineHeight:1.85,maxWidth:400,margin:"0 auto"}}>
            We're reviewing applications and will be in touch if you're selected for the first cohort. We'll reach out via email within two weeks.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="survey-wrap" style={{padding:"9rem 3rem",background:C.forest}}>
      <div style={{maxWidth:580,margin:"0 auto"}}>
        {/* Header */}
        <div className="reveal" style={{marginBottom:"3.5rem"}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"1.5rem",fontWeight:"bold"}}>
            Apply for the first cohort
          </div>
          <h2 style={{fontFamily:F.display,fontSize:"clamp(2rem,4vw,3rem)",fontWeight:400,fontStyle:"italic",color:C.offwhite,lineHeight:1.15,marginBottom:"1rem"}}>
            20 spots.<br/>
            <em style={{color:C.amber}}>We're selecting carefully.</em>
          </h2>
          <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:`${C.offwhite}66`,lineHeight:1.8}}>
            We want people who have genuinely tried other solutions and are ready to commit. Six quick questions.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{height:2,background:`${C.offwhite}18`,borderRadius:999,marginBottom:"2.5rem",overflow:"hidden"}}>
          <div style={{height:"100%",background:C.amber,borderRadius:999,width:`${progress}%`,transition:"width .4s ease"}}/>
        </div>

        {/* Question */}
        <div style={{minHeight:320}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".14em",textTransform:"uppercase",color:`${C.offwhite}44`,marginBottom:"1.2rem"}}>
            {step + 1} / {SURVEY_STEPS.length}
          </div>
          <h3 style={{fontFamily:F.display,fontSize:"clamp(1.3rem,2.5vw,1.8rem)",fontWeight:400,color:C.offwhite,marginBottom:current.subtext?".5rem":"2rem",lineHeight:1.3}}>
            {current.question}
          </h3>
          {current.subtext && (
            <p style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.offwhite}44`,marginBottom:"1.5rem"}}>{current.subtext}</p>
          )}

          {current.type === "single" && (
            <div style={{display:"flex",flexDirection:"column",gap:".6rem"}}>
              {current.options.map(opt => (
                <button key={opt} onClick={() => handleSingle(opt)} style={{
                  padding:"1rem 1.3rem",borderRadius:10,
                  background:answers[current.id]===opt?C.amber:`${C.offwhite}0e`,
                  border:`1px solid ${answers[current.id]===opt?C.amber:`${C.offwhite}22`}`,
                  color:answers[current.id]===opt?C.offwhite:`${C.offwhite}cc`,
                  fontFamily:F.sans,fontWeight:400,fontSize:".88rem",
                  textAlign:"left",transition:"all .15s ease",
                }}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === "multi" && (
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:".6rem",marginBottom:"1.5rem"}}>
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
                    <span style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${selected.includes(opt)?C.offwhite:`${C.offwhite}44`}`,background:selected.includes(opt)?`${C.offwhite}33`:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",color:C.offwhite}}>
                      {selected.includes(opt)?"✓":""}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                {step > 0 && (
                  <button onClick={() => { setStep(s => s - 1); setSelected(answers[SURVEY_STEPS[step-1].id] || []); }} style={{
                    background:"none",border:`1px solid ${C.offwhite}22`,borderRadius:999,
                    color:`${C.offwhite}66`,fontFamily:F.mono,fontSize:".6rem",
                    letterSpacing:".1em",textTransform:"uppercase",
                    padding:".88rem 1.2rem",cursor:"pointer",transition:"all .2s ease",
                  }}>← Back</button>
                )}
                <button onClick={handleMultiNext} disabled={selected.length===0} style={{
                  padding:".88rem 2rem",
                  background:selected.length>0?C.amber:`${C.offwhite}22`,
                  color:C.offwhite,border:"none",borderRadius:999,
                  fontFamily:F.sans,fontWeight:600,fontSize:".75rem",
                  letterSpacing:".08em",textTransform:"uppercase",
                  opacity:selected.length>0?1:.5,transition:"all .2s ease",
                }}>
                  Continue {current.max ? `(${selected.length}/${current.max})` : ""} →
                </button>
              </div>
            </div>
          )}

          {current.type === "email" && (
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <input
                value={email}
                onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                placeholder="your@email.com"
                type="email"
                style={{
                  padding:".9rem 1.2rem",borderRadius:10,
                  background:`${C.offwhite}0e`,border:`1px solid ${C.offwhite}22`,
                  color:C.offwhite,fontSize:".9rem",outline:"none",
                }}
              />
              <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                {step > 0 && (
                  <button onClick={() => { setStep(s => s - 1); setSelected(answers[SURVEY_STEPS[step-1].id] || []); }} style={{
                    background:"none",border:`1px solid ${C.offwhite}22`,borderRadius:999,
                    color:`${C.offwhite}66`,fontFamily:F.mono,fontSize:".6rem",
                    letterSpacing:".1em",textTransform:"uppercase",
                    padding:".9rem 1.2rem",cursor:"pointer",transition:"all .2s ease",
                  }}>← Back</button>
                )}
                <button onClick={handleSubmit} style={{
                  padding:".9rem 2rem",background:C.amber,color:C.offwhite,
                  border:"none",borderRadius:999,fontFamily:F.sans,
                  fontWeight:600,fontSize:".75rem",letterSpacing:".08em",
                  textTransform:"uppercase",
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
    <footer style={{background:C.forest,borderTop:`1px solid ${C.mossy}`,padding:"1.8rem 3rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:F.display,fontSize:".9rem",color:`${C.offwhite}44`}}>Mutual</span>
      <span style={{fontFamily:F.mono,fontSize:".52rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.offwhite}22`}}>Private beta · 2026</span>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{background:C.cream}}>
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
