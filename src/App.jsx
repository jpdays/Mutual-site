import { useState, useEffect } from "react";

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
      body{background:${C.cream};color:${C.forest};font-family:${F.sans};overflow-x:hidden}
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

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero-pad" style={{
      minHeight:"100dvh",display:"flex",flexDirection:"column",justifyContent:"flex-end",
      padding:"8rem 3.5rem 5.5rem",
      position:"relative",overflow:"hidden",
    }}>
      {/* Fallback colour */}
      <div style={{position:"absolute",inset:0,zIndex:0,background:C.forest}}/>
      {/* Background image */}
      <div style={{
        position:"absolute",inset:0,zIndex:1,
        backgroundImage:"url(https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80)",
        backgroundSize:"cover",backgroundPosition:"center 40%",
        backgroundRepeat:"no-repeat",
      }}/>
      {/* Dark overlay */}
      <div style={{
        position:"absolute",inset:0,zIndex:2,
        background:`linear-gradient(to top, rgba(36,48,40,.92) 25%, rgba(36,48,40,.7) 60%, rgba(36,48,40,.45) 100%)`,
      }}/>
      {/* Subtle warm tint */}
      <div style={{position:"absolute",inset:0,zIndex:3,background:`radial-gradient(ellipse at 15% 80%, ${C.amber}22 0%, transparent 55%)`}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.amber},${C.sage})`,zIndex:4}}/>

      <div style={{position:"relative",zIndex:5,maxWidth:860}}>
        <h1 style={{
          fontFamily:F.display,
          fontSize:"clamp(3rem,9vw,8.5rem)",
          fontWeight:400,lineHeight:.96,color:C.offwhite,
          letterSpacing:"-.01em",marginBottom:"2rem",
          animation:"fadeUp .9s .15s ease both",
        }}>
          <em style={{color:C.amber,fontStyle:"italic"}}>Your</em> phone.{" "}
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
              body:"Block apps completely or set daily time limits. Silence all notifications during work hours except your manager. Filter out specific websites and content in the browser. Enforce Do Not Disturb at night. Keep work and personal apps separate. Switch to greyscale after 9pm. Whatever you want to change, write it down.",
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
              display:"grid",gridTemplateColumns:"3.5rem 1fr",
              gap:"2rem",padding:"2.5rem 0",
              borderTop:`1px solid ${C.pale}`,
            }}>
              <span style={{fontFamily:F.mono,fontSize:".72rem",color:C.stone,paddingTop:".3rem",fontWeight:"bold"}}>{s.n}</span>
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

// ── FEATURE CARD 1 — Conversation ────────────────────────────
const SETUP_CHAT = [
  { side:"user",   text:"No Instagram after 9pm." },
  { side:"mutual", text:"Done. Instagram locks at 9pm every night." },
  { side:"user",   text:"And no LinkedIn on weekends." },
  { side:"mutual", text:"Added. LinkedIn is off Saturday and Sunday." },
  { side:"user",   text:"Can I still use WhatsApp?" },
  { side:"mutual", text:"Yes. Messaging stays on. Only what you asked to block gets blocked." },
];

function ConversationCard() {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (shown >= SETUP_CHAT.length) {
      const t = setTimeout(() => setShown(0), 3000);
      return () => clearTimeout(t);
    }
    const next = SETUP_CHAT[shown];
    if (next.side === "mutual") {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setShown(n => n + 1);
      }, 1200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShown(n => n + 1), 900);
      return () => clearTimeout(t);
    }
  }, [shown]);

  return (
    <div style={{background:C.offwhite,borderRadius:"2rem",padding:"1.8rem",border:`1px solid ${C.pale}`,minHeight:320,display:"flex",flexDirection:"column"}}>
      <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:C.sage,marginBottom:".4rem"}}>01 — Setup</div>
      <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1.15rem",color:C.forest,marginBottom:"1.4rem"}}>Just tell us what you want.</div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:".6rem",justifyContent:"flex-end"}}>
        {SETUP_CHAT.slice(0, shown).map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.side==="user"?"flex-end":"flex-start"}}>
            <div style={{
              maxWidth:"85%",padding:".55rem .9rem",borderRadius:12,
              background:m.side==="user"?C.forest:C.cream,
              border:`1px solid ${m.side==="user"?C.mossy:C.pale}`,
            }}>
              <span style={{fontFamily:F.sans,fontWeight:300,fontSize:".78rem",color:m.side==="user"?C.offwhite:C.stone,lineHeight:1.55}}>
                {m.text}
              </span>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{padding:".55rem .9rem",borderRadius:12,background:C.cream,border:`1px solid ${C.pale}`,display:"flex",gap:4,alignItems:"center"}}>
              {[0,1,2].map(i => (
                <div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.stone,opacity:.5,animation:`fadeUp .6s ${i*.15}s ease infinite alternate`}}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FEATURE CARD 2 — Time Arc Clock ──────────────────────────
function TimeArcCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => (n + 1) % 120), 100);
    return () => clearInterval(t);
  }, []);

  const hour = 9 + (tick / 120) * 14;
  const handAngle = ((hour % 12) / 12) * 360 - 90;
  const blockedStart = ((21 % 12) / 12) * 360;
  const blockedEnd   = ((7  % 12) / 12) * 360;

  function arcPath(cx, cy, r, startDeg, endDeg) {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg   * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = (endDeg - startDeg + 360) % 360 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const isBlocked = hour >= 21 || hour < 7;

  return (
    <div style={{background:C.forest,borderRadius:"2rem",padding:"1.8rem",border:`1px solid ${C.mossy}`,minHeight:300}}>
      <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:C.amber,marginBottom:".4rem"}}>02 — Rules you set</div>
      <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1.15rem",color:C.offwhite,marginBottom:"1.4rem"}}>As specific as your day.</div>
      <div style={{display:"flex",alignItems:"center",gap:"1.8rem"}}>
        <svg width="110" height="110" viewBox="0 0 110 110" style={{flexShrink:0}}>
          {/* Background circle */}
          <circle cx="55" cy="55" r="44" fill="none" stroke={`${C.offwhite}12`} strokeWidth="8"/>
          {/* Allowed arc (green) */}
          <path d={arcPath(55,55,44,-90+blockedEnd,-90+blockedStart)} fill="none" stroke={C.sage} strokeWidth="8" strokeLinecap="round" opacity=".7"/>
          {/* Blocked arc (amber) */}
          <path d={arcPath(55,55,44,-90+blockedStart,-90+blockedEnd+360)} fill="none" stroke={C.amber} strokeWidth="8" strokeLinecap="round" opacity=".85"/>
          {/* Hour hand */}
          <line
            x1="55" y1="55"
            x2={55 + 28 * Math.cos((handAngle * Math.PI)/180)}
            y2={55 + 28 * Math.sin((handAngle * Math.PI)/180)}
            stroke={C.offwhite} strokeWidth="2.5" strokeLinecap="round"
          />
          {/* Centre dot */}
          <circle cx="55" cy="55" r="3.5" fill={C.offwhite}/>
          {/* Status dot */}
          <circle cx="55" cy="55" r="14" fill={isBlocked?`${C.amber}22`:`${C.sage}22`}/>
        </svg>
        <div style={{flex:1}}>
          {[
            {label:"After 9pm",   status:"blocked",  color:C.amber},
            {label:"6am – 9am",   status:"allowed",  color:C.sage},
            {label:"Work hours",  status:"focus",    color:C.sage},
          ].map(r => (
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:".35rem 0",borderBottom:`1px solid ${C.offwhite}0e`}}>
              <span style={{fontFamily:F.sans,fontSize:".75rem",color:`${C.offwhite}88`}}>{r.label}</span>
              <span style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".1em",textTransform:"uppercase",color:r.color}}>{r.status}</span>
            </div>
          ))}
          <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".72rem",color:`${C.offwhite}55`,marginTop:".8rem",lineHeight:1.65}}>
            Blocked apps stay blocked. You cannot reinstall them.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FEATURE CARD 3 — Plan Timeline + Chat ────────────────────
const CHAT = [
  {side:"user", text:"No Instagram after 9pm. And I want to review in 4 weeks."},
  {side:"mutual", text:"Got it. Instagram blocks at 9pm every night. Check-in set for 28 days from now."},
  {side:"mutual", text:"We'll reach out when it's time. You can adjust the rules then."},
];

function PlanCard() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown < CHAT.length) {
      const t = setTimeout(() => setShown(n => n + 1), 1400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShown(0), 3500);
      return () => clearTimeout(t);
    }
  }, [shown]);

  return (
    <div style={{background:C.offwhite,borderRadius:"2rem",padding:"1.8rem",border:`1px solid ${C.pale}`,minHeight:300}}>
      <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:C.sage,marginBottom:".4rem"}}>03 — Your plan</div>
      <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1.15rem",color:C.forest,marginBottom:"1.4rem"}}>Set it. We hold it. We check in.</div>

      {/* Mini timeline */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:"1.4rem"}}>
        {[{label:"Setup",active:shown>=1},{label:"Active",active:shown>=2},{label:"Check-in",active:shown>=3}].map((s,i) => (
          <div key={s.label} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".2rem"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:s.active?C.amber:C.pale,transition:"background .4s ease",border:`2px solid ${s.active?C.amber:C.pale}`}}/>
              <span style={{fontFamily:F.mono,fontSize:".52rem",letterSpacing:".08em",textTransform:"uppercase",color:s.active?C.forest:C.stone,whiteSpace:"nowrap",transition:"color .4s ease"}}>{s.label}</span>
            </div>
            {i<2 && <div style={{flex:1,height:1.5,background:shown>i+1?C.amber:C.pale,transition:"background .4s ease",margin:"0 .3rem",marginBottom:"1rem"}}/>}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div style={{display:"flex",flexDirection:"column",gap:".5rem",minHeight:120}}>
        {CHAT.slice(0, shown).map((m, i) => (
          <div key={i} style={{
            display:"flex",justifyContent:m.side==="user"?"flex-end":"flex-start",
            animation:"fadeUp .35s ease both",
          }}>
            <div style={{
              maxWidth:"80%",padding:".55rem .85rem",borderRadius:12,
              background:m.side==="user"?C.forest:C.cream,
              border:`1px solid ${m.side==="user"?C.mossy:C.pale}`,
            }}>
              <span style={{fontFamily:F.sans,fontWeight:300,fontSize:".74rem",color:m.side==="user"?C.offwhite:C.stone,lineHeight:1.55}}>{m.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FEATURES SECTION ─────────────────────────────────────────
function Differentiation() {
  useReveal();
  return (
    <section className="section-pad" style={{padding:"7rem 3rem",background:C.cream,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:1060,margin:"0 auto"}}>
        <div className="reveal" style={{marginBottom:"3.5rem"}}>
          <div style={{fontFamily:F.mono,fontSize:".72rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:".75rem",fontWeight:"bold"}}>Features</div>
          <h2 style={{fontFamily:F.display,fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:400,lineHeight:1.15,color:C.forest}}>
            Built different.<br/>
            <em style={{fontStyle:"italic",color:C.amber}}>By design.</em>
          </h2>
        </div>
        <div className="feature-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:"1.2rem"}}>
          <div className="reveal" data-d=".08"><ConversationCard /></div>
          <div className="reveal" data-d=".18"><TimeArcCard /></div>
          <div className="reveal" data-d=".28"><PlanCard /></div>
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
