import { useState, useEffect } from "react";
import React from "react";

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
  white:   "#FFFFFF",
  screen:  "#F8F9FB",
  border:  "#D7DCE3",
  text:    "#1D2430",
  muted:   "#6E7785",
  blue:    "#4D8DFF",
  pink:    "#F26BAA",
  green:   "#53B483",
  yellow:  "#F2C14E",
  red:     "#E96A5F",
  lilac:   "#A78BFA",
};
const F = {
  display: '"EB Garamond", serif',
  sans:    '"Outfit", sans-serif',
  mono:    '"DM Mono", monospace',
};

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
      @keyframes pulseSoft{from{opacity:.45}to{opacity:1}}
      .reveal{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.25,.46,.45,.94),transform .8s cubic-bezier(.25,.46,.45,.94)}
      .reveal.on{opacity:1;transform:none}
      ::-webkit-scrollbar{width:2px}
      ::-webkit-scrollbar-thumb{background:${C.pale}}
      ::selection{background:${C.amber}33}
      input,select,textarea{font-family:${F.sans}}
      button{font-family:${F.sans};cursor:pointer}
      @media(max-width:900px){
        .demo-row{grid-template-columns:1fr !important;gap:1.75rem !important}
        .demo-copy{max-width:none !important}
      }
      @media(max-width:768px){
        .section-pad{padding:5rem 1.5rem !important}
        .hero-pad{padding:6rem 1.5rem 4rem !important}
        .two-col{grid-template-columns:1fr !important}
        .nav-links{display:none !important}
        .nav-center{font-size:.52rem !important;padding:.25rem .6rem !important}
        .feature-grid{grid-template-columns:1fr !important}
        .survey-wrap{padding:5rem 1.5rem !important}
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

  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1}}/>;
}

function Hero() {
  return (
    <section className="hero-pad" style={{
      minHeight:"100dvh",display:"flex",flexDirection:"column",justifyContent:"flex-end",
      padding:"8rem 3.5rem 5.5rem",position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",inset:0,zIndex:0,background:C.forest}}/>
      <ParticleCanvas />
      <div style={{position:"absolute",inset:0,zIndex:2,background:`linear-gradient(to top, rgba(36,48,40,.97) 20%, rgba(36,48,40,.75) 55%, rgba(36,48,40,.4) 100%)`}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.amber},${C.sage})`,zIndex:3}}/>
      <div style={{position:"relative",zIndex:4,maxWidth:860}}>
        <h1 style={{fontFamily:F.display,fontSize:"clamp(3.2rem,9vw,8.5rem)",fontWeight:400,lineHeight:.96,color:C.offwhite,letterSpacing:"-.01em",marginBottom:"2rem",animation:"fadeUp .9s .15s ease both"}}>
          <em style={{color:C.amber,fontStyle:"italic"}}>Your</em> phone.<br/>
          <em style={{color:C.amber,fontStyle:"italic"}}>Your</em> rules.
        </h1>
        <p style={{fontFamily:F.sans,fontWeight:300,fontSize:"clamp(.9rem,1.5vw,1.05rem)",lineHeight:1.85,color:`${C.offwhite}99`,maxWidth:520,animation:"fadeUp .9s .3s ease both"}}>
          We create mutually beneficial technology. A smartphone that keeps everything you need and removes only what you ask it to.
        </p>
      </div>
    </section>
  );
}

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
            { n:"00", title:"Apply and tell us about your phone", body:"If you have a spare Samsung or Google Pixel, we may be able to work with it. If not, we can arrange a phone for you." },
            { n:"01", title:"You tell us your rules", body:"Block apps completely or set daily time limits. Silence notifications during work hours. Filter specific websites and content. Switch to greyscale after 9pm. Whatever you want to change, write it down." },
            { n:"02", title:"We configure your phone", body:"We set it up at the system level. Not an app you can delete. Not a setting you can toggle off. The rules are set at a level your future self cannot easily undo." },
            { n:"03", title:"You live with it", body:"That's it. We check in. If the rules are not working, we adjust them. You are in control of what the rules are." },
          ].map((s,i) => (
            <div key={i} className="reveal" data-d={i*.1} style={{display:"grid",gridTemplateColumns:"2.5rem 1fr",gap:".75rem",padding:"2.5rem 0",borderTop:`1px solid ${C.pale}`}}>
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

function AppIcon({ label, color, glyph, dimmed = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: dimmed ? 0.28 : 1, transition: "opacity .45s ease, transform .45s ease" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)", fontSize: ".9rem" }}>{glyph}</div>
      <span style={{ fontFamily: F.sans, fontSize: ".42rem", color: C.muted }}>{label}</span>
    </div>
  );
}

function PhoneShell({ children, greyscale = false, time = "10:47" }) {
  return (
    <div style={{
      width: 228,
      minHeight: 438,
      padding: 8,
      background: "linear-gradient(180deg,#1f2a25 0%,#314239 100%)",
      borderRadius: 34,
      border: "1px solid rgba(255,255,255,.18)",
      boxShadow: "0 28px 80px rgba(36,48,40,.22)",
      overflow: "hidden",
      flexShrink: 0,
      filter: greyscale ? "saturate(0)" : "none",
      transition: "filter 1.2s ease",
    }}>
      <div style={{ background: C.white, minHeight: 422, borderRadius: 27, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 14px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.white }}>
          <span style={{ fontFamily: F.mono, fontSize: ".54rem", color: C.text }}>{time}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 7, borderRadius: 3, border: `1px solid ${C.text}` }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.text, opacity: .75 }} />
            <div style={{ width: 14, height: 6, borderRadius: 99, background: C.text, opacity: .8 }} />
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px 12px 14px", display: "flex", flexDirection: "column", background: greyscale ? "#E5E5E5" : C.screen }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SceneFrame({ children, label, title, body }) {
  return (
    <div className="demo-row" style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: "2.5rem", alignItems: "start" }}>
      {children}
      <div className="demo-copy" style={{ maxWidth: 520, textAlign: "left", justifySelf: "start" }}>
        <div style={{ fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: C.sage, marginBottom: ".6rem" }}>{label}</div>
        <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: "1.35rem", color: C.forest, marginBottom: body ? ".8rem" : 0 }}>{title}</div>
        {body ? <p style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".92rem", color: C.stone, lineHeight: 1.8, textAlign: "left" }}>{body}</p> : null}
      </div>
    </div>
  );
}

function Scene1() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delays = [800, 1800, 3000];
    const timers = delays.map((d, i) => setTimeout(() => setStep(i + 1), d));
    const reset = setTimeout(() => setStep(0), 6200);
    return () => { timers.forEach(clearTimeout); clearTimeout(reset); };
  }, [step === 0 ? undefined : null]);

  const apps = [
    ["Camera", C.pink, "📷"], ["Music", C.lilac, "🎵"], ["Mail", C.blue, "✉️"], ["Maps", C.green, "🗺️"],
    ["Shop", C.yellow, "🛒"], ["News", C.red, "📰"], ["Chat", C.green, "💬"], ["Settings", "#C6CBD3", "⚙️"],
  ];

  return (
    <SceneFrame label="01 — The opening" title="Just tell Eve what you want.">
      <PhoneShell>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14, marginTop: 2 }}>
          {apps.map(([label, color, glyph], i) => <AppIcon key={i} label={label} color={color} glyph={glyph} />)}
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {step >= 1 && (
            <div style={{ background: C.white, borderRadius: 16, padding: "12px 12px", border: `1px solid ${C.border}`, animation: "fadeUp .4s ease both", boxShadow: "0 6px 18px rgba(15,23,42,.05)" }}>
              <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 5 }}>EVE</div>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".68rem", color: C.text, lineHeight: 1.5 }}>Hi. What's on your mind?</div>
            </div>
          )}
          {step >= 2 && (
            <div style={{ background: C.amber, borderRadius: 16, padding: "12px 12px", animation: "fadeUp .4s ease both", boxShadow: "0 10px 20px rgba(184,114,58,.22)" }}>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".68rem", color: C.offwhite, lineHeight: 1.55 }}>I've been spending too much time on my phone and I need to change that.</div>
            </div>
          )}
          {step >= 3 && (
            <div style={{ background: C.white, borderRadius: 16, padding: "12px 12px", border: `1px solid ${C.border}`, animation: "fadeUp .4s ease both", boxShadow: "0 6px 18px rgba(15,23,42,.05)" }}>
              <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 5 }}>EVE</div>
              <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".68rem", color: C.text, lineHeight: 1.5 }}>Let me take a look at how you've been using it.</div>
            </div>
          )}
        </div>
      </PhoneShell>
    </SceneFrame>
  );
}

const ANALYSIS_LINES = [
  "Reviewing app usage — last 14 days...",
  "Instagram: 1h 42m average daily",
  "Pinterest: 38m average daily",
  "Google News: 29m average daily",
  "WhatsApp: active throughout the day",
  "",
  "Cross-referencing with calendar...",
  "Work hours identified: 9am – 6pm",
  "High usage overlap detected during work hours",
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
        if (i < ANALYSIS_LINES.length) setTimeout(addLine, l === "" ? 500 : l.startsWith("I think") ? 1000 : 240);
        else { setTimeout(() => setDone(true), 450); setTimeout(() => { setLines([]); setDone(false); }, 6200); }
      }
    };
    const t = setTimeout(addLine, 350);
    return () => clearTimeout(t);
  }, [done === false && lines.length === 0 ? undefined : null]);

  return (
    <SceneFrame label="02 — Eve analyses" title="It already knows your patterns." body="Eve reads your usage data before it says anything. When the plan arrives, it's built on evidence — not guesswork.">
      <PhoneShell>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 3, paddingTop: 4 }}>
          <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: C.amber, letterSpacing: ".1em", marginBottom: 8 }}>EVE — ANALYSING</div>
          {lines.map((l, i) => (
            <div key={i} style={{ fontFamily: F.mono, fontSize: ".56rem", color: l.startsWith("I think") ? C.text : l.startsWith("High") || l.startsWith("Most") ? C.amber : C.muted, lineHeight: 1.6, animation: "fadeUp .25s ease both", fontWeight: l.startsWith("I think") ? 400 : 300, paddingTop: l === "" ? 5 : 0 }}>{l || " "}</div>
          ))}
          {!done && lines.length > 0 && <span style={{ fontFamily: F.mono, fontSize: ".56rem", color: C.amber, animation: "pulseSoft .45s ease infinite alternate" }}>█</span>}
        </div>
      </PhoneShell>
    </SceneFrame>
  );
}

const PLAN_MSGS = [
  { side: "eve", text: "Based on your usage, I'd suggest blocking Instagram and Pinterest completely during work hours and keeping WhatsApp available. Want to go further?" },
  { side: "user", text: "Yes. Most notifications are distracting too. And make the phone less tempting to pick up." },
  { side: "eve", text: "Got it. I can silence all notifications during work hours except your boss and partner. And I can switch your phone to greyscale — less colour, less pull." },
  { side: "eve", text: "Let's try this for two weeks. I'll check in with you on the 14th to see if it's working. You can adjust anything before then." },
  { side: "user", text: "Let's do it." },
];

function Scene3() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (shown >= PLAN_MSGS.length) { setTimeout(() => setShown(0), 4200); return; }
    const m = PLAN_MSGS[shown];
    if (m.side === "eve") {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setShown(n => n + 1); }, m.text.length * 14 + 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown(n => n + 1), 900);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <SceneFrame label="03 — The plan" title="Eve recommends. You decide." body="Not a menu of options. A considered recommendation, built on your data. You adjust, confirm, and it is set for two weeks.">
      <PhoneShell>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, justifyContent: "flex-end" }}>
          {PLAN_MSGS.slice(0, shown).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.side === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease both" }}>
              <div style={{ maxWidth: "88%", padding: "8px 10px", borderRadius: 14, background: m.side === "user" ? C.amber : C.white, border: `1px solid ${m.side === "user" ? C.amber : C.border}`, boxShadow: m.side === "user" ? "0 8px 18px rgba(184,114,58,.18)" : "0 6px 16px rgba(15,23,42,.04)" }}>
                {m.side === "eve" && <div style={{ fontFamily: F.mono, fontSize: ".45rem", color: C.amber, letterSpacing: ".1em", marginBottom: 4 }}>EVE</div>}
                <span style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".6rem", color: m.side === "user" ? C.offwhite : C.text, lineHeight: 1.55 }}>{m.text}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "8px 10px", borderRadius: 14, background: C.white, border: `1px solid ${C.border}`, display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: C.muted, animation: `pulseSoft .5s ${i*.14}s ease infinite alternate` }} />)}
              </div>
            </div>
          )}
        </div>
      </PhoneShell>
    </SceneFrame>
  );
}

function Scene4() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const seq = [0, 1800, 3800, 6000, 9400];
    const timers = seq.map((d, i) => setTimeout(() => setPhase(i), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const isGrey = phase >= 2;
  const apps = [
    { name: "Maps", label: "Maps", glyph: "🗺️", color: C.green, visible: true },
    { name: "WhatsApp", label: "Chat", glyph: "💬", color: C.green, visible: true },
    { name: "Calendar", label: "Cal", glyph: "📅", color: C.white, visible: true },
    { name: "Mail", label: "Mail", glyph: "✉️", color: C.blue, visible: true },
    { name: "Instagram", label: "Insta", glyph: "📸", color: C.pink, visible: phase < 1 },
    { name: "Pinterest", label: "Pin", glyph: "📌", color: C.red, visible: phase < 1 },
    { name: "News", label: "News", glyph: "📰", color: C.yellow, visible: true },
    { name: "Spotify", label: "Music", glyph: "🎵", color: C.lilac, visible: true },
  ];

  return (
    <SceneFrame label="04 — The change" title="The phone actually changes." body="Apps disappear. Colour drains. The browser blocks. Not a notification. Not a reminder. The phone keeps its word.">
      <PhoneShell greyscale={isGrey} time={phase >= 3 ? "11:23" : "10:47"}>
        {phase < 3 ? (
          <>
            <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: isGrey ? "#666" : C.amber, letterSpacing: ".1em", marginBottom: 10 }}>
              {phase === 0 ? "HOME" : phase === 1 ? "EVE — CONFIGURING..." : "WORK MODE. UNTIL 6PM."}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {apps.map(app => (
                <div key={app.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .6s cubic-bezier(.34,1.56,.64,1)", transform: app.visible ? "scale(1)" : "scale(.5)", opacity: app.visible ? 1 : 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: app.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)" }}>{app.glyph}</div>
                  <span style={{ fontFamily: F.sans, fontSize: ".42rem", color: isGrey ? "#777" : C.muted }}>{app.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.sans, fontSize: ".56rem", color: isGrey ? "#666" : C.text }}>Notifications</span>
              <span style={{ fontFamily: F.mono, fontSize: ".58rem", color: isGrey ? "#666" : C.amber }}>{phase === 0 ? "47" : phase === 1 ? "14" : "2"}</span>
            </div>
            {phase >= 2 && (
              <div style={{ marginTop: "auto", background: C.white, borderRadius: 14, padding: "10px 10px", border: `1px solid ${C.border}`, animation: "fadeUp .5s ease both" }}>
                <div style={{ fontFamily: F.mono, fontSize: ".45rem", color: isGrey ? "#666" : C.amber, letterSpacing: ".1em", marginBottom: 3 }}>EVE</div>
                <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".58rem", color: isGrey ? "#666" : C.text, lineHeight: 1.5 }}>All set. I'll check in on the 14th. Good luck.</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 6px" }}>
            <div style={{ fontFamily: F.mono, fontSize: ".48rem", color: "#767676", letterSpacing: ".1em", marginBottom: 12 }}>INSTAGRAM.COM</div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: "1.15rem" }}>📸</div>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: ".7rem", color: "#4A4A4A", marginBottom: 6, lineHeight: 1.4 }}>Instagram is off until 6pm.</div>
            <div style={{ fontFamily: F.sans, fontWeight: 300, fontSize: ".6rem", color: "#767676", lineHeight: 1.5 }}>Enjoy the focus.</div>
          </div>
        )}
      </PhoneShell>
    </SceneFrame>
  );
}

function Differentiation() {
  useReveal();
  return (
    <section className="section-pad" style={{ padding: "7rem 3rem", background: C.cream, borderTop: `1px solid ${C.pale}` }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "left" }}>
        <div className="reveal" style={{ marginBottom: "4rem", textAlign: "left" }}>
          <div style={{ fontFamily: F.mono, fontSize: ".72rem", letterSpacing: ".2em", textTransform: "uppercase", color: C.sage, marginBottom: ".75rem", fontWeight: "bold" }}>Meet Eve</div>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.12, color: C.forest, maxWidth: 520, textAlign: "left" }}>
            Tell Eve what you want
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem", textAlign: "left" }}>
          <div className="reveal" data-d=".05"><Scene1 /></div>
          <div className="reveal" data-d=".1"><Scene2 /></div>
          <div className="reveal" data-d=".15"><Scene3 /></div>
          <div className="reveal" data-d=".2"><Scene4 /></div>
        </div>
      </div>
    </section>
  );
}

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
            <div key={i} className="reveal" data-d={i*.07} style={{display:"flex",gap:"1.5rem",alignItems:"flex-start",padding:"1.2rem 0",borderTop:`1px solid ${C.pale}`}}>
              <span style={{fontFamily:F.mono,fontSize:".6rem",color:C.amber,paddingTop:".2rem",flexShrink:0}}>→</span>
              <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".95rem",color:C.stone,lineHeight:1.8}}>{line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section id="apply" className="section-pad" style={{padding:"7rem 3rem 8rem",background:C.cream,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:820,margin:"0 auto",textAlign:"left"}}>
        <div style={{fontFamily:F.display,fontSize:"clamp(2rem,4vw,3.3rem)",lineHeight:1.08,color:C.forest,marginBottom:"1.25rem"}}>
          Start with the phone you already use.
        </div>
        <p style={{fontFamily:F.sans,fontWeight:300,fontSize:"1rem",color:C.stone,lineHeight:1.9,maxWidth:560,marginBottom:"2rem"}}>
          Tell us what you want your phone to stop doing. We will help turn that into rules that hold.
        </p>
        <a href="https://mutual.technology/" style={{display:"inline-block",fontFamily:F.sans,fontWeight:500,fontSize:".72rem",letterSpacing:".08em",textTransform:"uppercase",color:C.offwhite,textDecoration:"none",padding:".9rem 1.3rem",borderRadius:999,background:C.amber}}>
          Join the first cohort
        </a>
      </div>
    </section>
  );
}

export default function MutualSiteEditedPreview() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Proposition />
      <Differentiation />
      <WhoThisIsFor />
      <FooterCTA />
    </>
  );
}
