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
  display: '"EB Garamond", serif',
  sans:    '"Outfit", sans-serif',
  mono:    '"DM Mono", monospace',
};

// ── GLOBAL ────────────────────────────────────────────────────
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
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
      @keyframes typeLine{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
      .reveal{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.25,.46,.45,.94),transform .8s cubic-bezier(.25,.46,.45,.94)}
      .reveal.on{opacity:1;transform:none}
      ::-webkit-scrollbar{width:2px}
      ::-webkit-scrollbar-thumb{background:${C.pale}}
      ::selection{background:${C.amber}33}
      a{text-decoration:none}
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
      padding:"1.25rem 3rem",display:"flex",justifyContent:"space-between",alignItems:"center",
      background: scrolled ? `${C.cream}f2` : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.pale}` : "none",
      transition:"all .4s ease",
    }}>
      <span style={{fontFamily:F.display,fontSize:"1.15rem",fontWeight:500,color:scrolled?C.forest:C.offwhite,letterSpacing:".01em",transition:"color .4s ease"}}>
        Mutual
      </span>
      <a href="#cohort" style={{
        fontFamily:F.sans,fontWeight:500,fontSize:".72rem",letterSpacing:".1em",
        textTransform:"uppercase",color:C.offwhite,
        padding:".48rem 1.3rem",background:C.amber,borderRadius:999,
        transition:"opacity .2s ease",
      }}>
        Join the cohort
      </a>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{minHeight:"100dvh",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
      {/* Left — forest */}
      <div style={{
        display:"flex",flexDirection:"column",justifyContent:"flex-end",
        padding:"8rem 4rem 5.5rem 3.5rem",
        background:C.forest,position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.amber},${C.sage})`}}/>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 25% 70%, ${C.mossy}99 0%, transparent 65%)`,zIndex:0}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"2rem",animation:"fadeIn .8s ease both"}}>
            — A new kind of phone
          </div>
          <h1 style={{fontFamily:F.display,fontSize:"clamp(2.4rem,5.2vw,4.4rem)",fontWeight:400,lineHeight:1.1,color:C.offwhite,letterSpacing:"-.01em",animation:"fadeUp .9s .1s ease both"}}>
            Your phone was built<br/>
            to keep you on it.<br/>
            <em style={{color:C.amber,fontStyle:"italic"}}>We built the other one.</em>
          </h1>
        </div>
      </div>

      {/* Right — cream */}
      <div style={{
        display:"flex",flexDirection:"column",justifyContent:"flex-end",
        padding:"8rem 3.5rem 5.5rem 4rem",
        background:C.cream,borderLeft:`1px solid ${C.pale}`,
      }}>
        <h2 style={{fontFamily:F.display,fontSize:"clamp(1.6rem,3vw,2.6rem)",fontWeight:400,lineHeight:1.25,color:C.forest,letterSpacing:"-.01em",marginBottom:"2rem",animation:"fadeUp .9s .3s ease both"}}>
          It reconfigures itself<br/>
          around your day.<br/>
          You set the rules.<br/>
          <em style={{color:C.amber,fontStyle:"italic"}}>It holds them.</em>
        </h2>
        <p style={{fontFamily:F.sans,fontWeight:300,fontSize:"clamp(.88rem,1.3vw,1rem)",lineHeight:1.85,color:C.stone,maxWidth:360,animation:"fadeUp .9s .46s ease both"}}>
          Not an app. Not a timer. Not a blocklist.<br/>The phone itself — adaptive, persistent, and on your side.
        </p>
      </div>
    </section>
  );
}

// ── INTERVENTION SCREEN ───────────────────────────────────────
function PhoneScreen({ lines, active, dim }) {
  return (
    <div style={{
      width:220,height:400,
      background: dim ? "#1a1a1a" : "#0f1612",
      borderRadius:32,
      border:`1px solid ${dim?"#333":"#2a3d2e"}`,
      overflow:"hidden",
      boxShadow:`0 32px 80px ${C.forest}55`,
      position:"relative",
      flexShrink:0,
    }}>
      {/* Status bar */}
      <div style={{padding:"14px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:F.mono,fontSize:".55rem",color:dim?"#555":"#7A9E82"}}>9:41</span>
        <div style={{display:"flex",gap:4}}>
          {[1,1,1].map((b,i)=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:dim?"#444":"#7A9E82",opacity:1-i*.2}}/>)}
        </div>
      </div>

      {/* Screen content */}
      <div style={{padding:"28px 18px 0",display:"flex",flexDirection:"column",gap:6}}>
        {dim ? (
          // Busy screen — many apps
          <>
            <div style={{fontFamily:F.mono,fontSize:".52rem",color:"#555",marginBottom:8,letterSpacing:".1em"}}>NOTIFICATIONS</div>
            {["Instagram · 14 new","+12 messages","Twitter · trending","YouTube · 3 videos","LinkedIn · 5 alerts","Email · 22 unread","News · breaking"].map((t,i)=>(
              <div key={i} style={{background:"#1e1e1e",borderRadius:8,padding:"8px 10px",fontFamily:F.sans,fontSize:".6rem",color:"#666",borderLeft:`2px solid #333`}}>{t}</div>
            ))}
          </>
        ) : (
          // Mutual screen — clean intervention
          <>
            <div style={{fontFamily:F.mono,fontSize:".52rem",color:C.sage,marginBottom:12,letterSpacing:".1em"}}>MUTUAL</div>
            <div style={{background:"#182820",borderRadius:12,padding:"14px 12px",border:`1px solid ${C.mossy}66`}}>
              <div style={{fontFamily:F.mono,fontSize:".52rem",color:C.amber,marginBottom:8,letterSpacing:".1em"}}>NOTICED</div>
              {lines.map((line, i) => (
                <div key={i} style={{fontFamily:F.display,fontStyle:i===0?"normal":"italic",fontSize:line.size||".88rem",color:i===0?C.offwhite:C.sage,lineHeight:1.5,marginBottom:i===0?6:0,animation:`typeLine .4s ${i*.15}s ease both`}}>
                  {line.text}
                </div>
              ))}
            </div>
            {active && (
              <div style={{display:"flex",gap:6,marginTop:6}}>
                <div style={{flex:1,background:"#182820",borderRadius:8,padding:"9px 10px",fontFamily:F.sans,fontSize:".65rem",fontWeight:500,color:C.offwhite,textAlign:"center",border:`1px solid ${C.mossy}66`}}>Keep going</div>
                <div style={{flex:1,background:C.amber,borderRadius:8,padding:"9px 10px",fontFamily:F.sans,fontSize:".65rem",fontWeight:500,color:C.offwhite,textAlign:"center"}}>Put it down</div>
              </div>
            )}
            {/* Rest of screen — quiet */}
            <div style={{marginTop:8,opacity:.35}}>
              {["Messages","Maps","Calendar"].map((a,i)=>(
                <div key={i} style={{background:"#182820",borderRadius:8,padding:"8px 10px",fontFamily:F.sans,fontSize:".6rem",color:"#666",marginBottom:4}}>{a}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InterventionSection() {
  useReveal();
  const [scene, setScene] = useState(0);
  const scenes = [
    {
      label:"The intervention",
      lines:[
        {text:"You've opened Instagram 6 times in the last hour."},
        {text:"Still want to continue?", size:".82rem"},
      ],
      active:true,
      caption:"One question. No lecture. You decide.",
    },
    {
      label:"Deep work mode",
      lines:[
        {text:"Deep work until 11am."},
        {text:"6 notifications held. 1 that mattered came through.", size:".78rem"},
      ],
      active:false,
      caption:"The phone reconfigured itself. You didn't have to ask.",
    },
    {
      label:"The proactive surface",
      lines:[
        {text:"Tuesday 7am."},
        {text:"Your run playlist is ready.", size:".82rem"},
      ],
      active:false,
      caption:"It knows your patterns. It acts on them.",
    },
  ];
  const s = scenes[scene];

  return (
    <section style={{padding:"8rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div className="reveal" style={{marginBottom:"4rem"}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"1rem"}}>— What it looks like</div>
          <h2 style={{fontFamily:F.display,fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:400,lineHeight:1.15,color:C.forest}}>
            Show, don't describe.<br/>
            <em style={{fontStyle:"italic",color:C.amber}}>This is the phone.</em>
          </h2>
        </div>

        <div className="reveal" data-d=".1" style={{display:"flex",gap:"4rem",alignItems:"center",flexWrap:"wrap"}}>
          {/* Phone mockup */}
          <div style={{flexShrink:0}}>
            <PhoneScreen lines={s.lines} active={s.active} dim={false}/>
          </div>

          {/* Scene selector + caption */}
          <div style={{flex:1,minWidth:260}}>
            <div style={{display:"flex",flexDirection:"column",gap:".75rem",marginBottom:"2.5rem"}}>
              {scenes.map((sc,i)=>(
                <button key={i} onClick={()=>setScene(i)} style={{
                  display:"flex",alignItems:"center",gap:".9rem",
                  background:"none",border:"none",cursor:"pointer",
                  padding:".75rem 1rem",borderRadius:10,
                  background: scene===i ? C.forest : "transparent",
                  transition:"background .2s ease",
                  textAlign:"left",
                }}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:scene===i?C.amber:C.pale,flexShrink:0,transition:"background .2s ease"}}/>
                  <span style={{fontFamily:F.sans,fontWeight:scene===i?500:300,fontSize:".88rem",color:scene===i?C.offwhite:C.stone,transition:"color .2s ease"}}>{sc.label}</span>
                </button>
              ))}
            </div>
            <div style={{padding:"1.5rem",background:C.cream,borderRadius:14,border:`1px solid ${C.pale}`}}>
              <p style={{fontFamily:F.display,fontStyle:"italic",fontSize:"1.15rem",color:C.forest,lineHeight:1.6}}>
                "{s.caption}"
              </p>
            </div>
            <p style={{fontFamily:F.mono,fontSize:".58rem",color:C.pale,letterSpacing:".12em",marginTop:"1.2rem",textTransform:"uppercase"}}>
              Not a notification. Not an app. The phone itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAILED SOLUTIONS ──────────────────────────────────────────
const SOLUTIONS = [
  { n:"01", name:"Delete the apps",         cost:"Free",      note:"You come back. The data on this is unambiguous." },
  { n:"02", name:"Screen Time limits",       cost:"Free",      note:"One tap. 'Ignore Limit.' Done." },
  { n:"03", name:"Grayscale mode",           cost:"Free",      note:"Day 3: you stop noticing." },
  { n:"04", name:"App timers",               cost:"Free",      note:"You override them. Every time." },
  { n:"05", name:"Nokia brick",              cost:"~£30",      note:"Boarding pass. Bank app. Day 17." },
  { n:"06", name:"Light Phone 3",            cost:"$699",      note:"40,000+ preorders. Minimal. Static. Doesn't know you exist." },
  { n:"07", name:"VPN blocklist",            cost:"£5–15/mo",  note:"You found the workaround. You always find the workaround." },
  { n:"08", name:"Password to a loved one",  cost:"Free",      note:"You asked your friend to ask your mum. Your mum gave it." },
];

function FailedSolutions() {
  useReveal();
  return (
    <section style={{padding:"7rem 3rem",background:C.cream,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"5rem",marginBottom:"4.5rem",alignItems:"end"}}>
          <div className="reveal">
            <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"1rem"}}>— What exists</div>
            <h2 style={{fontFamily:F.display,fontSize:"clamp(1.9rem,3.5vw,2.8rem)",fontWeight:400,lineHeight:1.15,color:C.forest}}>
              Eight tools.<br/><em style={{fontStyle:"italic"}}>None of them work.</em>
            </h2>
          </div>
          <p className="reveal" data-d=".1" style={{fontFamily:F.sans,fontWeight:300,fontSize:"1rem",lineHeight:1.85,color:C.stone}}>
            Every solution on the market treats the phone as neutral and the person as the problem. It isn't. The phone was built to pull your attention toward it. The solution has to work at the same level.
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          {SOLUTIONS.map((s,i)=>(
            <div key={i} className="reveal" data-d={i*.04} style={{
              display:"grid",gridTemplateColumns:"3rem 1fr auto",
              gap:"2rem",padding:"1.4rem 0",
              borderTop:`1px solid ${C.pale}`,alignItems:"start",
            }}>
              <span style={{fontFamily:F.mono,fontSize:".6rem",color:C.pale,paddingTop:".15rem"}}>{s.n}</span>
              <div>
                <div style={{fontFamily:F.sans,fontWeight:500,fontSize:".92rem",color:C.forest,marginBottom:".25rem"}}>{s.name}</div>
                <div style={{fontFamily:F.display,fontStyle:"italic",fontSize:".9rem",color:C.stone,lineHeight:1.5}}>{s.note}</div>
              </div>
              <span style={{fontFamily:F.mono,fontSize:".6rem",color:C.pale,whiteSpace:"nowrap",paddingTop:".15rem",textAlign:"right"}}>{s.cost}</span>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${C.pale}`,paddingTop:"2.5rem",marginTop:".5rem"}}>
            <p className="reveal" style={{fontFamily:F.display,fontStyle:"italic",fontSize:"clamp(1.1rem,2.2vw,1.6rem)",lineHeight:1.55,color:C.forest,maxWidth:640}}>
              "Every tool here treats the phone as neutral. It isn't. Not one of them knows anything about you — your goals, your context, your day. They just say no."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── BEFORE / AFTER ────────────────────────────────────────────
const VISIONS = [
  {
    label:"Every morning",
    before:{ title:"You pick up your phone", body:"Before you're fully awake. Instagram. Email. News. Twenty minutes gone before you've had coffee. The day starts on the phone's terms." },
    after:{  title:"Tuesday 7am", body:"You run on Tuesdays. Your phone knows this. You pick it up — Spotify is open, playlist queued. No search. No friction." },
  },
  {
    label:"At work",
    before:{ title:"Notifications all day", body:"Every buzz a small interruption. Every interruption costs 23 minutes of focus. By 4pm the work is done but the day felt fragmented." },
    after:{  title:"Deep work until 11am", body:"Three apps. No social. One exception — your manager. 11am: six notifications held. One that mattered came through." },
  },
  {
    label:"In the evening",
    before:{ title:"The book on the nightstand", body:"Three weeks. It's been there three weeks. The phone is there too. Most nights the phone wins. Quietly, consistently." },
    after:{  title:"9:30pm", body:"The book app is in your dock. Social apps step back. The phone shifted. You didn't have to ask." },
  },
];

function Vision() {
  useReveal();
  return (
    <section style={{padding:"7rem 3rem",background:C.parch,borderTop:`1px solid ${C.pale}`}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div className="reveal" style={{marginBottom:"4.5rem"}}>
          <div style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:"1rem"}}>— What changes</div>
          <h2 style={{fontFamily:F.display,fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:400,lineHeight:1.15,color:C.forest}}>
            The same day.<br/><em style={{fontStyle:"italic",color:C.amber}}>A different phone.</em>
          </h2>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
          {VISIONS.map((v,i)=>(
            <div key={i} className="reveal" data-d={i*.1}>
              <div style={{fontFamily:F.mono,fontSize:".56rem",letterSpacing:".18em",textTransform:"uppercase",color:C.sage,marginBottom:".9rem"}}>{v.label}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                <div style={{padding:"2rem",background:C.cream,borderRadius:18,border:`1px solid ${C.pale}`}}>
                  <div style={{fontFamily:F.mono,fontSize:".55rem",letterSpacing:".14em",textTransform:"uppercase",color:C.pale,marginBottom:".8rem"}}>Now</div>
                  <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1rem",color:C.forest,marginBottom:".6rem"}}>{v.before.title}</div>
                  <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".85rem",color:C.stone,lineHeight:1.82}}>{v.before.body}</p>
                </div>
                <div style={{padding:"2rem",background:C.forest,borderRadius:18,border:`1px solid ${C.mossy}`,boxShadow:`0 12px 40px ${C.forest}22`}}>
                  <div style={{fontFamily:F.mono,fontSize:".55rem",letterSpacing:".14em",textTransform:"uppercase",color:C.amber,marginBottom:".8rem"}}>With Mutual</div>
                  <div style={{fontFamily:F.display,fontWeight:500,fontSize:"1rem",color:C.offwhite,marginBottom:".6rem"}}>{v.after.title}</div>
                  <p style={{fontFamily:F.sans,fontWeight:300,fontSize:".85rem",color:`${C.offwhite}88`,lineHeight:1.82}}>{v.after.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── COHORT CTA ────────────────────────────────────────────────
function Cohort() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  useReveal();

  return (
    <section id="cohort" style={{padding:"9rem 3rem",background:C.forest}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div className="reveal" style={{fontFamily:F.mono,fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.amber,marginBottom:"1.8rem"}}>
          — The first cohort
        </div>
        <h2 className="reveal" data-d=".08" style={{fontFamily:F.display,fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:400,fontStyle:"italic",color:C.offwhite,lineHeight:1.1,marginBottom:"1.5rem"}}>
          We're selecting 500 people<br/>
          to shape this before<br/>
          <em style={{color:C.amber}}>it launches publicly.</em>
        </h2>
        <p className="reveal" data-d=".16" style={{fontFamily:F.sans,fontWeight:300,fontSize:"1rem",lineHeight:1.85,color:`${C.offwhite}77`,marginBottom:"2.8rem",maxWidth:440}}>
          No spam. No pitch deck. Honest updates when something real is ready — and early access when it is.
        </p>

        {!done ? (
          <div className="reveal" data-d=".24" style={{display:"flex",gap:".7rem",flexWrap:"wrap"}}>
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setDone(true)}
              placeholder="your@email.com"
              style={{
                flex:"1 1 240px",padding:".88rem 1.2rem",
                background:"transparent",border:`1px solid ${C.offwhite}2e`,
                borderRadius:999,color:C.offwhite,
                fontFamily:F.sans,fontSize:".9rem",outline:"none",
              }}
            />
            <button
              onClick={()=>email.includes("@")&&setDone(true)}
              style={{
                padding:".88rem 2rem",background:C.amber,color:C.offwhite,
                border:"none",borderRadius:999,cursor:"pointer",
                fontFamily:F.sans,fontWeight:600,fontSize:".75rem",
                letterSpacing:".08em",textTransform:"uppercase",
              }}
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="reveal on" style={{fontFamily:F.display,fontStyle:"italic",fontSize:"1.3rem",color:C.amber,lineHeight:1.4}}>
            You're on the list.<br/>We'll be in touch.
          </div>
        )}

        <p className="reveal" data-d=".32" style={{fontFamily:F.mono,fontSize:".56rem",color:`${C.offwhite}33`,letterSpacing:".12em",textTransform:"uppercase",marginTop:"2rem"}}>
          {done ? "— Spot confirmed" : "— 500 spots · Early access · No commitment"}
        </p>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:C.forest,borderTop:`1px solid ${C.mossy}`,padding:"1.8rem 3rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:F.display,fontSize:".9rem",color:`${C.offwhite}44`}}>Mutual</span>
      <span style={{fontFamily:F.mono,fontSize:".52rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.offwhite}22`}}>© 2026</span>
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
      <InterventionSection />
      <FailedSolutions />
      <Vision />
      <Cohort />
      <Footer />
    </div>
  );
}
