import { useEffect, useRef, useState } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
img{max-width:100%;display:block;}
button,a{cursor:pointer;}

:root{
  --bg:#F9F8F5;--surface:#F1EFE9;--border:#E2DDD6;
  --void:#0F0F0E;--ink:#1C1B19;--muted:#7A7774;
  --signal:#E8A030;--signal-dk:#C8891F;--white:#FFFFFF;
  --serif:'Instrument Serif',Georgia,serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --ease-out:cubic-bezier(0.215,0.61,0.355,1);
  --ease-mag:cubic-bezier(0.25,0.46,0.45,0.94);
  --max:1160px;--max-narrow:680px;
}

body{font-family:var(--sans);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.75;overflow-x:hidden;}

#noise{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.045;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:200px 200px;}

.wrap{max-width:1080px;margin:0 auto;padding:0 40px;}
.wrap-narrow{max-width:640px;margin:0 auto;padding:0 40px;}
.wrap-mid{max-width:800px;margin:0 auto;padding:0 40px;}
.label{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:block;}
.label-lt{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(249,248,245,.38);margin-bottom:16px;display:block;}

h1,h2,h3{font-family:var(--sans);font-weight:600;letter-spacing:-0.025em;line-height:1.15;}
h1 em,h2 em,h3 em{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:-0.01em;}
p{line-height:1.85;}

.btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:100px;font-family:var(--sans);font-weight:500;letter-spacing:-.01em;position:relative;overflow:hidden;isolation:isolate;transition:transform .3s var(--ease-mag),box-shadow .3s var(--ease-mag);text-decoration:none;white-space:nowrap;}
.btn::before{content:'';position:absolute;inset:0;transform:translateY(101%);transition:transform .35s var(--ease-mag);z-index:-1;}
.btn:hover::before{transform:translateY(0);}
.btn:hover{transform:scale(1.03);}
.btn:active{transform:scale(.97);}
.btn-void{background:var(--void);color:var(--bg);}
.btn-void::before{background:#262624;}
.btn-signal{background:var(--signal);color:var(--void);}
.btn-signal::before{background:var(--signal-dk);}
.btn-ghost{background:none;border:none;font-family:var(--sans);font-size:14px;color:var(--muted);text-decoration:underline;text-underline-offset:3px;transition:color .2s;padding:0;}
.btn-ghost:hover{color:var(--ink);}
.btn-sm{padding:9px 20px;font-size:13px;}
.btn-md{padding:12px 26px;font-size:14px;}
.btn-lg{padding:15px 34px;font-size:15px;}

#topBar{background:var(--void);padding:9px 32px;z-index:500;position:fixed;top:0;left:0;right:0;transition:transform .35s var(--ease-out);}
#topBar.hidden{transform:translateY(-100%);}
.tb{max-width:var(--max);margin:0 auto;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;}
.tb-label{font-size:12px;color:rgba(249,248,245,.65);}
.tb-label strong{color:rgba(249,248,245,.9);font-weight:500;}
.tb-form{display:flex;align-items:center;border:1px solid rgba(249,248,245,.15);border-radius:100px;overflow:hidden;}
.tb-form input{background:transparent;border:none;outline:none;color:var(--bg);padding:5px 14px;font-size:12px;font-family:var(--sans);width:180px;}
.tb-form input::placeholder{color:rgba(249,248,245,.3);}
.tb-form button{background:var(--signal);border:none;color:var(--void);width:28px;height:28px;border-radius:50%;margin:2px;font-size:14px;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0;}
.tb-form button:hover{background:var(--signal-dk);}
.tb-ok{display:none;align-items:center;gap:6px;font-size:12px;color:var(--signal);}
.tb-ok.show{display:flex;}

#nav{position:fixed;top:46px;left:0;right:0;z-index:400;padding:0 32px;transition:background .4s var(--ease-out),border-color .4s var(--ease-out),backdrop-filter .4s,top .35s var(--ease-out);border-bottom:1px solid transparent;}
#nav.init{background:transparent;}
#nav.scrolled{background:rgba(249,248,245,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom-color:rgba(226,221,214,.5);top:0;}
.nav-inner{max-width:var(--max);margin:0 auto;height:66px;display:flex;align-items:center;justify-content:center;position:relative;}
.nav-links{position:absolute;left:0;display:flex;gap:28px;}
.nav-cta{position:absolute;right:0;}
.logo{font-family:var(--serif);font-size:22px;letter-spacing:-.02em;color:var(--void);text-decoration:none;line-height:1;}
.nav-links a{font-size:13px;font-weight:400;color:var(--muted);text-decoration:none;transition:color .2s,transform .2s var(--ease-mag);display:inline-block;}
.nav-links a:hover{color:var(--ink);transform:translateY(-1px);}

.s-hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:160px 40px 100px;background:var(--bg);position:relative;}
.hero-content{max-width:640px;text-align:center;margin:0 auto;}
.hero-h{font-family:var(--sans);font-weight:700;font-size:clamp(38px,5.5vw,68px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;color:var(--ink);}
.hero-h em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--ink);}
.hero-sub{font-size:clamp(16px,1.6vw,18px);color:var(--muted);line-height:1.75;margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto;font-weight:400;}

.s{padding:96px 0;}

.story-beat{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:0 40px;max-width:1080px;margin:0 auto;}
.story-beat.flip{direction:rtl;}
.story-beat.flip > *{direction:ltr;}
.story-text .label{margin-bottom:20px;}
.story-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:18px;color:var(--ink);max-width:380px;}
.story-text p{font-size:15px;color:var(--muted);line-height:1.9;max-width:380px;}
.story-text p+p{margin-top:14px;}
.story-stat{margin-top:24px;display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--muted);border-top:1px solid var(--border);padding-top:18px;}
.story-stat strong{color:var(--ink);font-size:15px;font-weight:600;}
.story-illus{width:100%;aspect-ratio:4/3;background:var(--surface);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:12px;text-align:center;padding:28px;border:1px solid var(--border);}

.s-statement{padding:96px 0;}
.statement-inner{max-width:640px;margin:0 auto;padding:0 40px;text-align:center;}
.statement-inner h2{font-size:clamp(26px,3vw,40px);margin-bottom:20px;color:var(--ink);}

.s-hiw{padding:96px 0;}
.hiw-inner{max-width:760px;margin:0 auto;padding:0 40px;}
.hiw-hdr{margin-bottom:56px;text-align:center;}
.hiw-hdr .label{font-size:13px;letter-spacing:.2em;}
.beats{display:flex;flex-direction:column;}
.beat{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;padding:52px 0;}
.beat:last-child{padding-bottom:0;}
.beat-text h3{font-size:clamp(18px,1.8vw,22px);margin-bottom:12px;color:var(--ink);}
.beat-text p{font-size:15px;color:var(--muted);line-height:1.85;}
.beat-text p em{font-family:var(--serif);font-style:italic;color:var(--ink);font-size:16px;}
.beat-illus{width:100%;aspect-ratio:3/2;background:var(--surface);border-radius:12px;border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--muted);font-size:11px;text-align:center;padding:20px;}

.s-ea{padding:104px 40px;text-align:center;background:var(--ink);color:var(--bg);}
.s-ea h2{font-size:clamp(30px,4vw,52px);margin-bottom:18px;color:var(--bg);font-weight:700;letter-spacing:-0.03em;}
.s-ea h2 em{font-family:var(--serif);font-style:italic;font-weight:400;}
.ea-body{font-size:16px;color:rgba(237,235,229,.5);max-width:480px;margin:0 auto 36px;line-height:1.85;}
.ea-note{margin-top:16px;font-size:12px;color:rgba(237,235,229,.28);letter-spacing:.03em;}

.s-about{padding:96px 0;}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1080px;margin:0 auto;padding:0 40px;}
.about-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:24px;max-width:380px;}
.about-text p{font-size:15px;line-height:1.9;color:var(--muted);margin-bottom:18px;max-width:380px;}
.about-text p:last-child{margin-bottom:0;}
.about-media{display:flex;flex-direction:column;gap:16px;}

.s-faq{padding:96px 0;}
.faq-inner{max-width:640px;margin:0 auto;padding:0 40px;}
.faq-inner h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:48px;}
.faq-item{border-top:1px solid var(--border);}
.faq-item:last-child{border-bottom:1px solid var(--border);}
.faq-q{width:100%;background:none;border:none;text-align:left;font-family:var(--sans);font-size:15px;font-weight:500;color:var(--ink);padding:20px 0;display:flex;justify-content:space-between;align-items:center;gap:16px;line-height:1.4;letter-spacing:-0.01em;transition:color .2s;}
.faq-q:hover{color:var(--muted);}
.chev{width:18px;height:18px;flex-shrink:0;color:var(--muted);transition:transform .35s var(--ease-out);}
.faq-item.open .chev{transform:rotate(180deg);}
.faq-a{font-size:14px;line-height:1.8;color:var(--muted);max-height:0;overflow:hidden;transition:max-height .4s var(--ease-out),padding-bottom .4s;}
.faq-item.open .faq-a{max-height:300px;padding-bottom:22px;}

.site-footer{background:var(--ink);padding:80px 40px 44px;}
.footer-wl{text-align:center;margin-bottom:72px;padding-bottom:56px;border-bottom:1px solid rgba(249,248,245,.07);}
.footer-wl p{font-size:15px;color:rgba(237,235,229,.4);margin-bottom:20px;font-weight:400;}
.footer-form{display:inline-flex;border:1px solid rgba(249,248,245,.1);border-radius:100px;overflow:hidden;max-width:360px;width:100%;}
.footer-form input{flex:1;background:transparent;border:none;outline:none;color:var(--bg);padding:11px 20px;font-size:13px;font-family:var(--sans);}
.footer-form input::placeholder{color:rgba(249,248,245,.22);}
.footer-form button{background:var(--signal);color:var(--void);border:none;padding:11px 20px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;transition:background .2s;white-space:nowrap;}
.footer-form button:hover{background:var(--signal-dk);}
.footer-form-ok{display:none;margin-top:12px;font-size:13px;color:var(--signal);}
.footer-form-ok.show{display:block;}
.footer-btm{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:12px;color:rgba(249,248,245,.18);}
.footer-links{display:flex;gap:24px;}
.footer-links a{color:inherit;text-decoration:none;transition:color .2s;}
.footer-links a:hover{color:rgba(249,248,245,.5);}

.apply-nav{background:var(--bg);border-bottom:1px solid var(--border);padding:0 40px;position:sticky;top:0;z-index:100;}
.apply-nav-inner{max-width:720px;margin:0 auto;height:62px;display:flex;align-items:center;justify-content:space-between;}
.apply-body{max-width:720px;margin:0 auto;padding:72px 40px 96px;}
.apply-body h1{font-size:clamp(28px,4vw,46px);letter-spacing:-0.03em;line-height:1.1;margin-bottom:14px;}
.apply-body h1 em{font-family:var(--serif);font-style:italic;font-weight:400;}
.apply-sub{font-size:15px;color:var(--muted);line-height:1.8;margin-bottom:48px;max-width:480px;}
.tally-card{background:var(--white);border-radius:16px;border:1px solid var(--border);padding:36px;margin-bottom:18px;}
.deposit-card{background:var(--surface);border-radius:10px;border:1px solid var(--border);padding:18px 22px;font-size:14px;color:var(--muted);line-height:1.7;}

[data-a]{opacity:0;transform:translateY(32px);transition:opacity .6s var(--ease-out),transform .6s var(--ease-out);}
[data-a="1"]{transition-delay:.1s;}
[data-a="2"]{transition-delay:.18s;}
[data-a="3"]{transition-delay:.26s;}
[data-a].in{opacity:1;transform:translateY(0);}

@media(max-width:860px){
  .story-beat,.beat{grid-template-columns:1fr;gap:32px;}
  .story-beat.flip{direction:ltr;}
  .story-illus,.beat-illus{display:none;}
  .about-grid{grid-template-columns:1fr;padding:0 24px;}
  .about-media{display:none;}
  .story-text h2,.story-text p{max-width:100%;}
  .about-text h2,.about-text p{max-width:100%;}
}
@media(max-width:640px){
  #topBar{padding:8px 20px;}
  .tb-label{display:none;}
  .tb{justify-content:center;}
  #nav{padding:0 20px;}
  .nav-links{display:none;}
  .s-hero{padding:140px 24px 80px;}
  .wrap,.wrap-narrow,.wrap-mid{padding:0 24px;}
  .story-beat,.hiw-inner,.faq-inner,.statement-inner{padding:0 24px;}
  .site-footer{padding:64px 24px 40px;}
  .tally-card{padding:24px 20px;}
  .apply-nav,.apply-body{padding-left:24px;padding-right:24px;}
  .s-ea{padding:80px 24px;}
  .s,.s-hiw,.s-faq,.s-about,.s-statement{padding:72px 0;}
}
`;

const ChevronIcon = () => (
  <svg className="chev" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        {question}<ChevronIcon />
      </button>
      <div className="faq-a"><p>{answer}</p></div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('main');
  const [tbOk, setTbOk] = useState(false);
  const [footerOk, setFooterOk] = useState(false);
  const tbEmailRef = useRef();
  const footerEmailRef = useRef();
  const heroRef = useRef();
  const navRef = useRef();
  const topBarRef = useRef();

  const goApply = () => { setPage('apply'); window.scrollTo({top:0,behavior:'instant'}); };
  const goMain  = () => { setPage('main');  window.scrollTo({top:0,behavior:'instant'}); };

  // Nav + topbar scroll behavior
  useEffect(() => {
    if (page !== 'main') return;
    const hero = heroRef.current;
    const nav  = navRef.current;
    const bar  = topBarRef.current;
    if (!hero || !nav || !bar) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        bar.classList.remove('hidden');
        nav.classList.remove('scrolled');
        nav.classList.add('init');
      } else {
        bar.classList.add('hidden');
        nav.classList.remove('init');
        nav.classList.add('scrolled');
      }
    }, { threshold: 0.05 });
    io.observe(hero);
    return () => io.disconnect();
  }, [page]);

  // Scroll animations
  useEffect(() => {
    const els = document.querySelectorAll('[data-a]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  const handleTbSubmit = (e) => {
    e.preventDefault();
    console.log('Waitlist:', tbEmailRef.current.value);
    setTbOk(true);
    /* TODO: POST to Supabase leads table */
  };

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    console.log('Footer waitlist:', footerEmailRef.current.value);
    setFooterOk(true);
    /* TODO: POST to Supabase leads table */
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    { q: 'What phone will I receive?', a: 'A Samsung Galaxy A17, pre-configured by us before it arrives. No setup required on your end.' },
    { q: 'What happens to my current phone?', a: "You keep it. Most users keep their current device as a backup, especially for the first week. You're not giving anything up." },
    { q: 'Can I still use WhatsApp, maps, and banking apps?', a: "Yes. Mutual removes what pulls you away — not what you actually need. You tell us what stays, and it stays." },
    { q: 'Can I still download and delete apps?', a: "Yes, with one exception. You can download and delete anything freely, except the apps you specifically asked us to manage." },
    { q: 'What if I want to change something?', a: "You message us. We make the adjustment. The friction is intentional, it keeps you accountable, but we're here to make it work for you, not to be dogmatic about it." },
    { q: 'How long does this last?', a: "A few weeks. Enough time to actually feel a difference. After that, you decide whether to continue, adjust, or stop." },
    { q: 'Why is there a £10 deposit?', a: "To make sure the people who apply actually mean it. If you're not selected for this cohort, you'll receive a full refund or we'll roll it to the next opening — your choice." },
    { q: "What if it's not working for me?", a: "That's exactly the feedback we need. We'll work with you to understand what's not working and adjust. This cohort is as much about us learning as it is about you changing." },
  ];

  return (
    <>
      <style>{css}</style>
      <div id="noise" aria-hidden="true" />

      {/* TOP BAR */}
      <div id="topBar" ref={topBarRef}>
        <div className="tb">
          <span className="tb-label"><strong>Stay Updated</strong>&ensp;News on spot openings and product development</span>
          {!tbOk ? (
            <form className="tb-form" onSubmit={handleTbSubmit}>
              <input type="email" placeholder="Email address" required ref={tbEmailRef} />
              <button type="submit">→</button>
            </form>
          ) : (
            <span className="tb-ok show">✓ You're on the list</span>
          )}
        </div>
      </div>

      {/* MAIN PAGE */}
      {page === 'main' && (
        <div id="page-main">

          {/* NAV */}
          <nav id="nav" className="init" ref={navRef}>
            <div className="nav-inner">
              <a className="logo" href="#" onClick={(e) => { e.preventDefault(); goMain(); }}>mutual.</a>
              <div className="nav-links">
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How it works</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
              </div>
              <button className="btn btn-void btn-sm nav-cta" onClick={goApply}>Request Early Access</button>
            </div>
          </nav>

          {/* HERO */}
          <section className="s-hero" id="hero" ref={heroRef}>
            <div className="hero-content">
              <h1 className="hero-h" data-a="">The first smartphone<br />that <em>enforces your rules.</em></h1>
              <p className="hero-sub" data-a="1">You decide which apps you want and when. The phone makes sure it stays that way.</p>
              <div data-a="2">
                <button className="btn btn-void btn-lg" onClick={goApply}>Request Early Access →</button>
              </div>
            </div>
          </section>

          {/* PROBLEM */}
          <section className="s" id="why">
            <div className="story-beat" data-a="">
              <div className="story-text">
                <span className="label">The problem</span>
                <h2>Smartphones are affecting our sleep, focus and attention span.</h2>
                <p>The apps are designed by people whose job is to keep you there. You're fighting a billion-dollar engagement machine.</p>
                <p>Current solutions are not up to the task.</p>
              </div>
              <div className="story-illus" data-a="1">
                <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                  <rect x="10" y="60" width="100" height="60" rx="8" fill="#F1EFE9" stroke="#E2DDD6" strokeWidth="1"/>
                  <ellipse cx="60" cy="62" rx="22" ry="22" fill="#E2DDD6"/>
                  <rect x="38" y="90" width="44" height="28" rx="4" fill="#E8DDD6"/>
                  <rect x="30" y="100" width="12" height="18" rx="6" fill="#D8D3CC"/>
                  <rect x="78" y="100" width="12" height="18" rx="6" fill="#D8D3CC"/>
                  <rect x="44" y="26" width="32" height="52" rx="6" fill="#0F0F0E"/>
                  <rect x="47" y="30" width="26" height="40" rx="4" fill="#1C1B19"/>
                  <rect x="51" y="35" width="18" height="3" rx="1.5" fill="#E8A030" fillOpacity="0.6"/>
                  <rect x="51" y="42" width="14" height="2" rx="1" fill="#3a3938"/>
                  <rect x="51" y="48" width="16" height="2" rx="1" fill="#3a3938"/>
                  <rect x="51" y="54" width="12" height="2" rx="1" fill="#3a3938"/>
                </svg>
                <p>Illustration: person scrolling in bed at night</p>
              </div>
            </div>
          </section>

          {/* APP BLOCKERS */}
          <section className="s">
            <div className="story-beat flip" data-a="">
              <div className="story-text">
                <span className="label">Why app blockers fail</span>
                <h2>The bypass button is always right there.</h2>
                <p>One tap to ignore the limit. Two taps to uninstall.</p>
                <p>And you're right back at square one.</p>
                <div className="story-stat">
                  <strong>70%</strong> said screen time limits were too easy to bypass
                </div>
              </div>
              <div className="story-illus" data-a="1">
                <svg width="80" height="130" viewBox="0 0 80 130" fill="none">
                  <rect x="5" y="5" width="70" height="120" rx="10" fill="#0F0F0E"/>
                  <rect x="9" y="12" width="62" height="106" rx="7" fill="#1C1B19"/>
                  <rect x="16" y="22" width="48" height="6" rx="3" fill="#2a2a29"/>
                  <rect x="16" y="38" width="48" height="36" rx="5" fill="#262625"/>
                  <rect x="22" y="44" width="36" height="4" rx="2" fill="#3a3938"/>
                  <rect x="22" y="52" width="28" height="3" rx="1.5" fill="#2f2e2d"/>
                  <rect x="16" y="82" width="48" height="10" rx="4" fill="#2a2a29"/>
                  <rect x="20" y="86" width="22" height="3" rx="1.5" fill="#4a4948"/>
                  <rect x="16" y="97" width="48" height="10" rx="4" fill="#2a2a29"/>
                  <rect x="20" y="101" width="28" height="3" rx="1.5" fill="#4a4948"/>
                  <rect x="16" y="112" width="48" height="10" rx="4" fill="#E8A030" fillOpacity="0.8"/>
                  <text x="40" y="120" fontFamily="sans-serif" fontSize="5.5" fill="#0F0F0E" textAnchor="middle" fontWeight="600">Ignore limit for today</text>
                </svg>
                <p>Illustration: screen time bypass popup</p>
              </div>
            </div>
          </section>

          {/* DUMB PHONES */}
          <section className="s">
            <div className="story-beat" data-a="">
              <div className="story-text">
                <span className="label">Why dumb or minimal phones fail</span>
                <h2>A minimal phone solves distraction by removing everything.</h2>
                <p>No TikTok, but also no Uber, no banking apps, no boarding pass, no WhatsApp.</p>
                <p>Most people who try it come back. Because modern life requires a modern phone.</p>
              </div>
              <div className="story-illus" data-a="1">
                <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
                  <circle cx="55" cy="38" r="20" fill="#F1EFE9" stroke="#E2DDD6" strokeWidth="1"/>
                  <line x1="55" y1="58" x2="55" y2="76" stroke="#E2DDD6" strokeWidth="2"/>
                  <line x1="55" y1="76" x2="40" y2="95" stroke="#E2DDD6" strokeWidth="2"/>
                  <line x1="55" y1="76" x2="70" y2="95" stroke="#E2DDD6" strokeWidth="2"/>
                  <line x1="55" y1="65" x2="36" y2="58" stroke="#E2DDD6" strokeWidth="2"/>
                  <line x1="55" y1="65" x2="74" y2="58" stroke="#E2DDD6" strokeWidth="2"/>
                  <circle cx="105" cy="28" r="18" fill="#F8F7F4" stroke="#E2DDD6" strokeWidth="1"/>
                  <text x="105" y="35" fontFamily="Georgia,serif" fontSize="18" fill="#C8891F" textAnchor="middle">?</text>
                  <rect x="82" y="60" width="36" height="22" rx="4" fill="#F1EFE9" stroke="#E2DDD6" strokeWidth="1"/>
                  <rect x="87" y="66" width="26" height="3" rx="1.5" fill="#E2DDD6"/>
                  <rect x="87" y="73" width="18" height="3" rx="1.5" fill="#E2DDD6"/>
                </svg>
                <p>Illustration: stranded without modern apps</p>
              </div>
            </div>
          </section>

          {/* SOLUTION */}
          <section className="s-statement" id="solution">
            <div className="statement-inner" data-a="">
              <span className="label">The answer</span>
              <h2>A phone that understands your objectives and helps you achieve them.</h2>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="s-hiw" id="how-it-works">
            <div className="hiw-inner">
              <div className="hiw-hdr" data-a="">
                <span className="label">How it works</span>
              </div>
              <div className="beats">

                <div className="beat">
                  <div className="beat-text" data-a="">
                    <h3>You receive the phone.</h3>
                    <p>Once accepted into the early access cohort, we send you a pre-configured Samsung device.</p>
                  </div>
                  <div className="beat-illus" style={{background:'var(--surface)',padding:'16px',overflow:'hidden'}}>
                    <img src="public/Delivery.png" alt="Phone delivered by post" style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}} />
                  </div>
                </div>

                <div className="beat">
                  <div className="beat-text" data-a="">
                    <h3>You tell us your objective.</h3>
                    <p>Which apps, at what times, for how long? <em>No Instagram after 9pm. Weekends: 30 minutes max.</em> You decide.</p>
                  </div>
                  <div className="beat-illus" data-a="1">
                    <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
                      <rect x="5" y="5" width="50" height="90" rx="9" fill="white" stroke="#E2DDD6" strokeWidth="1"/>
                      <rect x="13" y="16" width="34" height="7" rx="3.5" fill="#E8A030" fillOpacity="0.6"/>
                      <rect x="13" y="29" width="24" height="3.5" rx="1.5" fill="#E2DDD6"/>
                      <rect x="13" y="37" width="30" height="3.5" rx="1.5" fill="#F1EFE9"/>
                      <rect x="13" y="45" width="20" height="3.5" rx="1.5" fill="#F1EFE9"/>
                      <rect x="13" y="58" width="34" height="22" rx="5" fill="#F1EFE9"/>
                      <rect x="18" y="64" width="20" height="3" rx="1.5" fill="#E2DDD6"/>
                      <rect x="18" y="71" width="26" height="3" rx="1.5" fill="#E2DDD6"/>
                    </svg>
                    <p>Configuration setup</p>
                  </div>
                </div>

                <div className="beat">
                  <div className="beat-text" data-a="">
                    <h3>We configure it at the system level.</h3>
                    <p>Not an app, the phone itself. Enforced at the Operating System level. You choose how long it holds: a day, two weeks, indefinitely?</p>
                  </div>
                  <div className="beat-illus" data-a="1">
                    <svg width="54" height="96" viewBox="0 0 54 96" fill="none">
                      <rect x="2" y="2" width="50" height="92" rx="10" fill="#0F0F0E"/>
                      <rect x="6" y="10" width="42" height="74" rx="6" fill="#1C1B19"/>
                      <circle cx="27" cy="48" r="15" fill="none" stroke="#E8A030" strokeWidth="2"/>
                      <path d="M21 48 L26 53 L34 43" stroke="#E8A030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <rect x="14" y="71" width="26" height="4" rx="2" fill="#2a2a29"/>
                      <circle cx="27" cy="90" r="3.5" fill="#2a2a29"/>
                    </svg>
                    <p>System configured</p>
                  </div>
                </div>

                <div className="beat">
                  <div className="beat-text" data-a="">
                    <h3>We check in.</h3>
                    <p>We review what's working together. If the plan doesn't work, we adjust. The goal isn't restriction, it's finding the configuration that sticks for you.</p>
                  </div>
                  <div className="beat-illus" data-a="1">
                    <svg width="110" height="72" viewBox="0 0 110 72" fill="none">
                      <rect x="4" y="6" width="44" height="60" rx="8" fill="white" stroke="#E2DDD6" strokeWidth="1"/>
                      <rect x="11" y="18" width="30" height="6" rx="3" fill="#E8A030" fillOpacity="0.5"/>
                      <rect x="11" y="29" width="22" height="3" rx="1.5" fill="#E2DDD6"/>
                      <rect x="11" y="36" width="26" height="3" rx="1.5" fill="#F1EFE9"/>
                      <rect x="62" y="6" width="44" height="60" rx="8" fill="white" stroke="#E2DDD6" strokeWidth="1"/>
                      <rect x="69" y="18" width="30" height="6" rx="3" fill="#E2DDD6"/>
                      <rect x="69" y="29" width="18" height="3" rx="1.5" fill="#F1EFE9"/>
                      <rect x="69" y="46" width="30" height="5" rx="2.5" fill="#E8A030" fillOpacity="0.28"/>
                      <rect x="69" y="54" width="18" height="5" rx="2.5" fill="#E8A030" fillOpacity="0.65"/>
                    </svg>
                    <p>Check-in and adjust</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* EARLY ACCESS */}
          <section className="s-ea" id="early-access">
            <div data-a="">
              <span className="label-lt">Early access</span>
              <h2>We're accepting the first <em>20 users.</em></h2>
              <p className="ea-body">We are reviewing applications to join our platform and look forward to welcoming you soon.</p>
              <button className="btn btn-signal btn-lg" onClick={goApply}>Apply Now →</button>
              <p className="ea-note">£10 deposit confirms your spot. Full refund if not selected, or roll to the next cohort.</p>
            </div>
          </section>

          {/* ABOUT */}
          <section className="s-about" id="about">
            <div className="about-grid">
              <div className="about-text" data-a="">
                <span className="label">About</span>
                <h2>Built from a simple frustration.</h2>
                <p>Smartphone overuse is the most documented, least solved problem in consumer technology. We have tried most solutions out there, but they either ask you to rely on willpower or take away too much. We think that's the wrong approach.</p>
                <p>We're two founders building in London. We're looking for the right people to build this with.</p>
              </div>
              <div className="about-media" data-a="1">
                <video src="public/BetaIntroVideo.mp4" controls style={{width:'100%',borderRadius:'12px',display:'block'}} />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="s-faq" id="faq">
            <div className="faq-inner">
              <h2 data-a="">Frequently asked questions</h2>
              <div className="faq-list">
                {faqs.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} />)}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="site-footer">
            <div className="wrap">
              <div className="footer-wl" id="footer-wl" data-a="">
                <p>Leave your email and we'll keep you updated.</p>
                {!footerOk ? (
                  <form className="footer-form" onSubmit={handleFooterSubmit}>
                    <input type="email" placeholder="Email address" required ref={footerEmailRef} />
                    <button type="submit">Stay updated</button>
                  </form>
                ) : (
                  <p className="footer-form-ok show">✓ You're on the list</p>
                )}
              </div>
              <div className="footer-btm">
                <span>© mutual. 2026</span>
                <div className="footer-links">
                  <a href="#">Privacy</a>
                  <a href="#">Terms</a>
                </div>
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* APPLY PAGE */}
      {page === 'apply' && (
        <div id="page-apply">
          <nav className="apply-nav">
            <div className="apply-nav-inner">
              <span className="logo">mutual.</span>
              <button className="btn-ghost" onClick={goMain}>← Back</button>
            </div>
          </nav>
          <div className="apply-body">
            <p className="label">Early access application</p>
            <h1>Answer a few quick<br /><em>questions to apply.</em></h1>
            <p className="apply-sub">If you're a fit, we'll confirm your spot and send next steps.</p>
            <div className="tally-card">
              <iframe
                src="https://tally.so/embed/RGRWGK?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="580"
                frameBorder="0"
                title="mutual. Early Access Application"
              />
            </div>
            <div className="deposit-card">
              If you're not selected for the first cohort, you'll receive a full refund or we'll roll it to the next opening. Whichever you prefer.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
