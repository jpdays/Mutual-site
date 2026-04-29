import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jcgelvlzwfearecpoaxg.supabase.co",
  "sb_publishable_dlyG3pjDXQwPt7XRSIsxgA_tN-PItUj"
);

const STRIPE_APPLY    = "https://buy.stripe.com/bJeaEP6cO13LfKF0EBgMw02";
const STRIPE_PREORDER = "https://buy.stripe.com/3cI3cn44GdQx9mhbjfgMw03";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Geist:wght@400;500;600;700&display=swap');

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
  --display:'Geist',var(--sans);
  --ease-out:cubic-bezier(0.215,0.61,0.355,1);
  --ease-mag:cubic-bezier(0.25,0.46,0.45,0.94);
  --max:1280px;
}

body{font-family:var(--sans);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.75;overflow-x:hidden;}

#noise{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.045;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:200px 200px;}

.wrap{max-width:1240px;margin:0 auto;padding:0 40px;}
.label{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:block;}

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
.hero-cta-wrap{display:flex;justify-content:center;margin-top:8px;}
.hero-cta-form{display:flex;align-items:stretch;border:1px solid var(--border);border-radius:100px;overflow:hidden;background:var(--white);transition:border-color .2s,box-shadow .2s;max-width:380px;width:100%;}
.hero-cta-form:focus-within{border-color:rgba(28,27,25,.3);box-shadow:0 0 0 4px rgba(28,27,25,.06);}
.hero-cta-input{flex:1;border:none;outline:none;background:transparent;padding:11px 18px;font-family:var(--sans);font-size:13px;color:var(--ink);min-width:0;}
.hero-cta-input::placeholder{color:rgba(122,119,116,.55);}
.hero-cta-btn{background:var(--void);color:var(--bg);border:none;padding:0 20px;font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:-.01em;cursor:pointer;transition:background .2s;white-space:nowrap;}
.hero-cta-btn:hover{background:#262624;}
@media(max-width:640px){
  .hero-cta-form{max-width:320px;}
  .hero-cta-input{padding:9px 14px;font-size:12px;}
  .hero-cta-btn{padding:0 14px;font-size:12px;}
}
.hero-cta-ok{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:500;color:#22863a;letter-spacing:-.01em;}
.hero-cta-ok svg{width:18px;height:18px;}

/* NAV */
#nav{position:fixed;top:0;left:0;right:0;z-index:400;padding:0 32px;transition:background .4s var(--ease-out),border-color .4s var(--ease-out),backdrop-filter .4s;border-bottom:1px solid transparent;}
#nav.init{background:transparent;}
#nav.scrolled{background:rgba(249,248,245,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom-color:rgba(226,221,214,.5);top:0;}
.nav-inner{max-width:var(--max);margin:0 auto;height:74px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;}
.nav-logo-group{display:flex;align-items:center;gap:36px;justify-self:start;}
.nav-launching{font-family:var(--sans);font-size:14px;font-weight:700;color:var(--void);letter-spacing:-.01em;text-align:center;white-space:nowrap;justify-self:center;}
.nav-right{display:flex;align-items:center;gap:10px;justify-self:end;}
.nav-learn-link{font-size:13px;font-weight:500;color:var(--ink);text-decoration:none;transition:color .2s,transform .2s var(--ease-mag);display:inline-block;white-space:nowrap;}
.nav-learn-link:hover{color:var(--void);transform:translateY(-1px);}
.logo{font-family:var(--serif);font-size:22px;letter-spacing:-.02em;color:var(--void);text-decoration:none;line-height:1;}
.logo-img{display:inline-flex;align-items:center;height:28px;}
.logo-img img{height:100%;width:auto;display:block;}

/* HERO */
.s-hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:160px 40px 100px;background:var(--bg);position:relative;}
.hero-content{max-width:760px;text-align:center;margin:0 auto;}
.hero-h{font-family:var(--sans);font-weight:700;font-size:clamp(38px,5.5vw,68px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;color:var(--ink);}
.hero-h em{font-family:var(--serif);font-style:italic;font-weight:400;color:#f97316;}
.hero-sub{font-size:clamp(16px,1.6vw,18px);color:var(--muted);line-height:1.75;margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto;font-weight:400;}
.hero-sub + .hero-sub{margin-top:-28px;}

.s{padding:96px 0;}

/* STORY BEATS */
.story-beat{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:0 40px;max-width:var(--max);margin:0 auto;}
.story-beat.flip{direction:rtl;}
.story-beat.flip > *{direction:ltr;}
.story-text .label{margin-bottom:20px;}
.story-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:18px;color:var(--ink);max-width:380px;}
.story-text p{font-size:15px;color:var(--muted);line-height:1.9;max-width:380px;}
.story-text p+p{margin-top:14px;}
.story-stat{margin-top:24px;display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--muted);border-top:1px solid var(--border);padding-top:18px;}
.story-stat strong{color:var(--ink);font-size:15px;font-weight:600;}
.story-illus{width:100%;aspect-ratio:4/3;background:var(--surface);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:12px;text-align:center;padding:28px;border:1px solid var(--border);position:relative;overflow:hidden;}

/* HOW IT WORKS */
.s-howitworks{width:100%;overflow:hidden;background:#FFFFFF;border-top:1px solid var(--border);padding:100px 0 60px;}
.hiw-header{max-width:min(1680px,calc(100vw - 64px));margin:0 auto;padding:0 32px 72px;}
.hiw-header h2{font-size:clamp(30px,2.8vw,46px);font-weight:600;letter-spacing:-0.03em;line-height:1.18;margin-top:8px;max-width:760px;}
.hiw-em-orange{color:#f97316;}
.hiw-frame{position:relative;width:min(1680px,calc(100vw - 64px));aspect-ratio:1440 / 880;height:auto;margin:0 auto;}
.hiw-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;}
.hiw-node{position:absolute;left:var(--node-x);top:var(--node-y);width:var(--node-w);height:var(--node-h);display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;z-index:2;}
.hiw-node-img{flex:1;display:flex;align-items:center;justify-content:center;width:100%;padding:6px 6px 0;background:transparent;min-height:0;overflow:hidden;}
.hiw-node-slide{flex:0 0 100%;height:100%;display:flex;align-items:center;justify-content:center;padding:0 8px;}
.hiw-node-slide img,
.hiw-node-img > img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;}
.hiw-node-track{display:flex;height:100%;width:100%;transition:transform .9s cubic-bezier(.22,.61,.36,1);will-change:transform;}
.hiw-node-label{padding:0 10px 16px;display:flex;justify-content:center;text-align:center;order:-1;}
.hiw-node-title{font-size:clamp(14px,1.15vw,18px);font-weight:500;letter-spacing:-0.01em;line-height:1.3;color:var(--ink);width:100%;}
.hiw-node-dots{display:flex;align-items:center;justify-content:center;gap:8px;padding-top:14px;}
.hiw-node-dot{width:8px;height:8px;border:none;border-radius:999px;background:rgba(28,27,25,.18);padding:0;transition:transform .24s var(--ease-mag),background-color .24s var(--ease-out),width .24s var(--ease-out);}
.hiw-node-dot:hover{background:rgba(28,27,25,.34);transform:scale(1.08);}
.hiw-node-dot:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(28,27,25,.08);}
.hiw-node-dot.active{width:22px;background:var(--ink);}

/* PRICING */
.s-pricing{padding:clamp(80px,12vh,140px) 0 clamp(64px,10vh,120px);background:#FFFFFF;scroll-margin-top:66px;}
.pricing-shell{max-width:min(1180px,calc(100vw - 64px));margin:0 auto;padding:0;}
.pricing-panel{display:grid;grid-template-columns:minmax(320px,460px) minmax(380px,460px);justify-content:center;align-items:center;column-gap:clamp(40px,6vw,88px);row-gap:32px;}
.pricing-media{display:flex;justify-content:center;align-items:center;justify-self:center;width:100%;}
.pricing-device{width:clamp(400px,42vw,470px);}
.pricing-device img{width:100%;height:auto;display:block;max-height:calc(85vh - 66px);object-fit:contain;filter:drop-shadow(0 30px 40px rgba(17,16,14,.16));}
.pricing-content{width:min(100%,440px);}

/* PRICING — editorial, card-free */
.pe-content{display:flex;flex-direction:column;max-width:420px;width:100%;}

/* Headline block */
.pe-headline-mobile{display:none;}
.pe-headline{margin-bottom:28px;text-align:left;}
.pe-headline h2,.pe-headline-mobile h2{font-size:clamp(24px,2.6vw,32px);font-weight:600;letter-spacing:-0.03em;line-height:1.2;color:var(--ink);margin:0;text-align:left;}
.pe-headline em,.pe-headline-mobile em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--ink);}
.pe-orange{color:#f97316;font-family:var(--serif);font-style:italic;font-weight:400;}
.pe-pricing{margin-bottom:24px;}
.pe-price-row{display:flex;align-items:baseline;gap:10px;}
.pe-price-now{font-family:var(--display);font-size:clamp(36px,4.2vw,44px);font-weight:700;letter-spacing:-0.045em;line-height:1;color:var(--ink);}
.pe-price-was{font-size:16px;color:var(--muted);text-decoration:line-through;opacity:.7;}
.pe-price-note{font-size:13px;color:#5a5754;margin-top:10px;line-height:1.55;}
.pe-refund{font-size:13px;color:var(--ink);margin-top:6px;line-height:1.55;}
.pe-colour{margin-bottom:8px;}
.pe-colour-label{font-size:13px;color:var(--ink);margin-bottom:10px;font-weight:500;}
.pe-colour-options{display:flex;gap:10px;flex-wrap:wrap;}
.pe-colour-btn{display:inline-flex;align-items:center;gap:8px;padding:7px 14px 7px 8px;border-radius:100px;border:1px solid var(--border);background:var(--white);font-family:var(--sans);font-size:13px;color:var(--ink);cursor:pointer;transition:border-color .18s,box-shadow .18s,transform .18s var(--ease-mag);}
.pe-colour-btn:hover{border-color:rgba(28,27,25,.4);transform:translateY(-1px);}
.pe-colour-btn.active{border-color:var(--void);box-shadow:0 0 0 1px var(--void) inset;}
.pe-swatch{width:18px;height:18px;border-radius:50%;display:inline-block;border:1px solid rgba(0,0,0,.08);}

/* Cohort status */
.pe-status{margin-bottom:32px;}
.pe-status-primary{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);line-height:1.4;margin-bottom:4px;}
.pe-status-secondary{font-size:11px;font-weight:400;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);opacity:.7;line-height:1.4;}

/* Membership block */
.pe-membership{margin-bottom:0;}
.pe-membership-title{font-size:13px;font-weight:600;color:var(--muted);letter-spacing:-0.01em;margin-bottom:10px;}
.pe-price-block{display:flex;align-items:baseline;gap:0;}
.pe-price{font-family:var(--display);font-size:clamp(36px,4.2vw,44px);font-weight:700;letter-spacing:-0.045em;line-height:1;color:var(--ink);}
.pe-price-unit{font-size:14px;font-weight:400;color:var(--muted);opacity:.6;margin-left:5px;letter-spacing:0;}
.pe-cancel{font-size:13px;color:var(--muted);margin-top:8px;line-height:1;}

/* Section gap */
.pe-gap{height:1px;background:rgba(0,0,0,.06);margin:28px 0;}

/* What's included */
.pe-includes-title{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;}
.pe-includes{display:flex;flex-direction:column;gap:14px;list-style:none;padding:0;margin:0;}
.pe-include-item{font-family:var(--sans);font-size:14px;color:var(--ink);line-height:1.45;padding-left:16px;position:relative;list-style:none;}
.pe-include-item::before{content:'';position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:var(--muted);opacity:.3;}
.pe-include-item a{color:inherit;text-decoration:none;}

/* CTA row */
.pe-cta{display:flex;gap:12px;margin-top:28px;}
.pe-btn-primary{flex:1.3;display:flex;align-items:center;justify-content:center;border:none;border-radius:10px;background:linear-gradient(180deg,#1e1e1e 0%,#000 100%);color:#fff;min-height:48px;padding:0 20px;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:-.01em;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.12);transition:transform .26s var(--ease-mag),box-shadow .26s var(--ease-out);}
.pe-btn-primary:hover{transform:scale(1.03);box-shadow:0 8px 22px rgba(0,0,0,.26);}
.pe-btn-primary:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(0,0,0,.1),0 8px 20px rgba(0,0,0,.2);}
.pe-btn-primary:active{transform:scale(.97);}
.pe-btn-secondary{flex:1;display:flex;align-items:center;justify-content:center;border:1px solid rgba(0,0,0,.13);border-radius:10px;background:transparent;color:var(--muted);min-height:48px;padding:0 16px;font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:-.01em;text-decoration:none;transition:color .18s var(--ease-out),background .18s var(--ease-out),border-color .18s;}
.pe-btn-secondary:hover{color:var(--ink);background:rgba(0,0,0,.03);border-color:rgba(0,0,0,.2);}
.pe-btn-secondary:focus-visible{outline:none;}
.pe-btn-secondary:active{background:rgba(0,0,0,.06);}

@media(max-width:980px){
  .pricing-panel{column-gap:clamp(32px,4vw,48px);}
}
@media(max-width:860px){
  .pricing-panel{grid-template-columns:1fr;justify-content:center;justify-items:center;}
  .pricing-content{width:min(100%,520px);margin:0 auto;padding:0 4px;}
  .pe-content{max-width:100%;}
  .pe-headline-mobile{display:block;width:min(100%,520px);margin:0 auto 24px;padding:0 4px;}
  .pe-headline{display:none;}
  .pe-btn-primary{font-size:12px;padding:0 14px;}
  .s-howitworks{padding:84px 0 44px;}
  .hiw-header{max-width:100%;padding:0 24px 40px;}
  .hiw-frame{width:min(640px,calc(100vw - 48px));aspect-ratio:auto;display:grid;grid-template-columns:1fr;gap:52px;}
  .hiw-svg{display:none;}
  .hiw-node{position:relative;left:auto;top:auto;width:100%;height:auto;}
  .hiw-node-label{padding:0 0 14px;}
  .hiw-node-title{font-size:16px;}
  .hiw-node-img{padding:0;aspect-ratio:4 / 3;min-height:250px;}
  .hiw-node-dots{padding-top:16px;}
}
@media(max-width:640px){
  .s-pricing{padding:60px 0 72px;}
  .pricing-shell{padding:0 16px;}
  .pe-price{font-size:clamp(30px,8vw,38px);}
  .hiw-header{padding:0 24px 32px;}
  .hiw-header h2{max-width:12ch;}
  .hiw-header h2 em{display:block;}
  .hiw-frame{width:calc(100vw - 48px);gap:44px;}
  .hiw-node-img{min-height:220px;}
  .pricing-device{width:min(100%,420px);margin:0 auto;}
  .pricing-content{padding:0 2px;}
}

/* ABOUT */
.s-about{padding:96px 0;}
.s-action{padding:60px 40px 96px;background:var(--bg);}
.action-header{max-width:var(--max);margin:0 auto 56px;text-align:center;}
.action-grid{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.action-copy{justify-self:end;max-width:440px;}
.ar-title{font-size:22px;font-weight:600;letter-spacing:-.02em;color:var(--void);margin:0 0 18px;line-height:1.2;}
.ar-rows{margin:0;padding:0;display:flex;flex-direction:column;gap:18px;}
.ar-row{display:flex;flex-direction:column;gap:4px;}
.ar-label{font-size:13px;font-weight:500;color:rgba(28,27,25,.55);letter-spacing:-.005em;line-height:1.4;}
.ar-value{margin:0;font-size:15px;font-weight:400;color:var(--ink);line-height:1.55;letter-spacing:-.005em;}
.ar-divider{height:1px;background:rgba(0,0,0,.06);margin:28px 0 24px;}
.ar-subtitle{font-size:18px;font-weight:600;letter-spacing:-.015em;color:var(--void);margin:0 0 6px;line-height:1.2;}
.ar-state{margin:0;font-size:15px;color:var(--ink);line-height:1.55;}
.ar-foot{margin:14px 0 0;font-size:13px;color:rgba(28,27,25,.6);line-height:1.5;}
.action-media{justify-self:start;width:100%;max-width:288px;border-radius:24px;overflow:hidden;background:var(--void);box-shadow:0 30px 60px -20px rgba(15,15,14,.25),0 12px 24px -8px rgba(15,15,14,.18);}
.action-media video{display:block;width:100%;height:auto;}
.section-cta-wrap{display:flex;justify-content:center;margin-top:48px;}
.btn-community{background:var(--void);color:var(--bg);border:none;padding:11px 22px;border-radius:100px;font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:-.01em;cursor:pointer;transition:background .2s,transform .2s var(--ease-mag);}
.btn-community:hover{background:#262624;transform:translateY(-1px);}
.section-cta-form{display:flex;align-items:stretch;border:1px solid var(--border);border-radius:100px;overflow:hidden;background:var(--white);transition:border-color .2s,box-shadow .2s;max-width:380px;width:100%;}
.section-cta-form:focus-within{border-color:rgba(28,27,25,.3);box-shadow:0 0 0 4px rgba(28,27,25,.06);}
.section-cta-input{flex:1;border:none;outline:none;background:transparent;padding:11px 18px;font-family:var(--sans);font-size:13px;color:var(--ink);min-width:0;}
.section-cta-input::placeholder{color:rgba(122,119,116,.55);}
.section-cta-btn{background:var(--void);color:var(--bg);border:none;padding:0 20px;font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:-.01em;cursor:pointer;transition:background .2s;white-space:nowrap;}
.section-cta-btn:hover{background:#262624;}
.section-cta-ok{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#22863a;letter-spacing:-.01em;}
.section-cta-ok svg{width:16px;height:16px;}
@media(max-width:640px){
  .section-cta-form{max-width:320px;}
  .section-cta-input{padding:9px 14px;font-size:12px;}
  .section-cta-btn{padding:0 14px;font-size:12px;}
}
@media (max-width:900px){
  .action-grid{grid-template-columns:1fr;gap:48px;}
  .action-copy,.action-media{justify-self:center;}
  .s-action{padding:44px 24px 72px;}
}
@media (max-width:760px){
  .hiw-header,.action-header{text-align:center;}
  .hiw-header .label,.action-header .label{display:inline-block;}
  .hiw-header h2{margin-left:auto;margin-right:auto;}
  .about-text{text-align:center;}
  .about-text h2,.about-text p{margin-left:auto;margin-right:auto;}
  .about-text .label{display:inline-block;}
}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:var(--max);margin:0 auto;padding:0 40px;}
.about-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:24px;max-width:380px;}
.about-text p{font-size:15px;line-height:1.9;color:var(--muted);margin-bottom:18px;max-width:380px;}
.about-text p:last-child{margin-bottom:0;}
.about-media{display:flex;flex-direction:column;gap:16px;}
.about-photo{width:100%;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:var(--surface);border:1px solid var(--border);}
.about-photo img{width:100%;height:100%;object-fit:cover;display:block;}
.about-headshots{display:flex;gap:20px;align-items:center;justify-content:center;flex-wrap:nowrap;}
.headshot{width:140px;height:140px;border-radius:50%;overflow:hidden;background:var(--surface);border:1px solid var(--border);flex-shrink:0;}
.headshot img{width:100%;height:100%;object-fit:cover;display:block;}
@media(max-width:760px){
  .about-headshots{gap:14px;}
  .headshot{width:120px;height:120px;}
}

/* FAQ */
.s-faq{padding:96px 0;}
.faq-inner{max-width:760px;margin:0 auto;padding:0 40px;}
.faq-inner h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:48px;}
.faq-item{border-top:1px solid var(--border);}
.faq-item:last-child{border-bottom:1px solid var(--border);}
.faq-q{width:100%;background:none;border:none;text-align:left;font-family:var(--sans);font-size:15px;font-weight:500;color:var(--ink);padding:20px 0;display:flex;justify-content:space-between;align-items:center;gap:16px;line-height:1.4;letter-spacing:-0.01em;transition:color .2s;}
.faq-q:hover{color:var(--muted);}
.chev{width:18px;height:18px;flex-shrink:0;color:var(--muted);transition:transform .35s var(--ease-out);}
.faq-item.open .chev{transform:rotate(180deg);}
.faq-a{font-size:14px;line-height:1.8;color:var(--muted);max-height:0;overflow:hidden;transition:max-height .4s var(--ease-out),padding-bottom .4s;}
.faq-item.open .faq-a{max-height:300px;padding-bottom:22px;}

/* NAV WAITLIST */
.nav-waitlist{display:flex;align-items:center;gap:10px;}
.nav-waitlist-label{font-size:13px;font-weight:500;color:var(--muted);letter-spacing:-.01em;white-space:nowrap;}
.nav-waitlist-form{display:flex;align-items:center;border:1px solid var(--border);border-radius:100px;overflow:hidden;background:var(--white);transition:border-color .2s,box-shadow .2s;}
.nav-waitlist-form:focus-within{border-color:rgba(28,27,25,.3);box-shadow:0 0 0 3px rgba(28,27,25,.06);}
.nav-waitlist-input{border:none;outline:none;background:transparent;padding:11px 18px;font-family:var(--sans);font-size:14px;color:var(--ink);width:210px;}
.nav-waitlist-input::placeholder{color:rgba(122,119,116,.55);}
.nav-waitlist-btn{background:none;border:none;border-left:1px solid var(--border);padding:0 16px;height:44px;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;transition:color .18s,background .18s;}
.nav-waitlist-btn:hover{color:var(--ink);background:rgba(28,27,25,.04);}
.nav-waitlist-btn:active{background:rgba(28,27,25,.08);}
.nav-waitlist-btn svg{width:16px;height:16px;display:block;}
.nav-waitlist-ok{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:#22863a;letter-spacing:-.01em;white-space:nowrap;}
.nav-waitlist-ok svg{width:15px;height:15px;flex-shrink:0;}
@media(max-width:760px){
  .nav-inner{height:auto;padding:14px 0;grid-template-columns:auto auto;grid-template-rows:auto auto;row-gap:12px;}
  .nav-logo-group{grid-column:1;grid-row:1;}
  .nav-launching{grid-column:1 / -1;grid-row:2;font-size:13px;}
  .nav-right{grid-column:2;grid-row:1;gap:8px;}
  .nav-waitlist-label{display:none;}
  .nav-waitlist-input{width:160px;padding:9px 14px;font-size:13px;}
  .nav-waitlist-btn{height:38px;padding:0 12px;}
  .nav-waitlist-btn svg{width:14px;height:14px;}
}
@media(max-width:760px){
  .nav-learn-link{display:none;}
}
@media(max-width:480px){
  .nav-waitlist-input{width:130px;}
}

/* FOOTER */
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

/* SUBPAGE NAV */
.sub-nav{background:var(--bg);border-bottom:1px solid var(--border);padding:0 40px;position:sticky;top:0;z-index:100;}
.sub-nav-inner{max-width:var(--max);margin:0 auto;height:62px;display:flex;align-items:center;justify-content:space-between;}

/* SPEC TABS */
.s-specs{padding:80px 0 96px;background:var(--bg);}
.specs-shell{max-width:var(--max);margin:0 auto;padding:0 40px;}
.specs-header{margin-bottom:48px;}
.specs-header h2{font-size:clamp(22px,2.4vw,30px);font-weight:600;letter-spacing:-0.025em;color:var(--ink);}
.spec-tab-bar{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:40px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
.spec-tab-bar::-webkit-scrollbar{display:none;}
.spec-tab{background:none;border:none;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--muted);padding:12px 20px;letter-spacing:-0.01em;position:relative;white-space:nowrap;transition:color .2s;cursor:pointer;}
.spec-tab::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease-out);}
.spec-tab:hover{color:var(--ink);}
.spec-tab.active{color:var(--ink);}
.spec-tab.active::after{transform:scaleX(1);}
.spec-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px 24px;}
.spec-item-label{font-size:13px;font-weight:600;color:var(--ink);letter-spacing:-0.01em;margin-bottom:6px;line-height:1.35;}
.spec-item-value{font-size:14px;color:var(--muted);line-height:1.6;}
@media(max-width:860px){.spec-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.spec-grid{grid-template-columns:1fr;gap:24px;}.spec-tab{padding:10px 14px;font-size:13px;}.specs-shell{padding:0 24px;}}

/* LEARN MORE hero divider */
.lm-divider{height:1px;background:var(--border);max-width:var(--max);margin:0 auto;}
.lm-banner{padding:96px 40px 0;background:#FFFFFF;}
.lm-banner-inner{max-width:var(--max);margin:0 auto;text-align:left;padding-left:clamp(24px,4vw,80px);}
.lm-banner h1{font-size:clamp(24px,2.4vw,32px);line-height:1.2;letter-spacing:-.02em;color:var(--void);margin:0;}
.lm-banner h1 em{font-family:var(--serif);font-style:italic;font-weight:400;}
.lm-banner + .s-pricing{padding-top:clamp(20px,3vh,40px);}
@media (max-width:760px){
  .lm-banner{padding:80px 24px 0;}
  .lm-banner-inner{padding-left:0;}
}

/* APPLY PAGE */
.apply-nav{background:var(--void);border-bottom:1px solid rgba(249,248,245,.08);padding:0 40px;position:sticky;top:0;z-index:100;}
.apply-nav-inner{max-width:var(--max);margin:0 auto;height:62px;display:flex;align-items:center;justify-content:space-between;}
.apply-nav .logo{color:var(--bg);}
.apply-nav .btn-ghost{color:rgba(249,248,245,.72);}
.apply-nav .btn-ghost:hover{color:var(--bg);}

.apply-shell{min-height:calc(100vh - 62px);display:grid;grid-template-columns:1fr 1fr;align-items:stretch;}

/* Left panel — dark context column */
.apply-left{background:var(--void);padding:72px 56px 80px;display:flex;flex-direction:column;justify-content:space-between;position:sticky;top:62px;height:calc(100vh - 62px);overflow-y:auto;}
.apply-left-top{flex:1;}
.apply-eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(249,248,245,.35);margin-bottom:28px;display:block;}
.apply-h{font-family:var(--sans);font-size:clamp(40px,5vw,68px);font-weight:700;letter-spacing:-0.04em;line-height:1.02;color:var(--bg);margin-bottom:24px;max-width:10ch;}
.apply-h em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--signal);}
.apply-desc{font-size:18px;color:rgba(249,248,245,.62);line-height:1.8;margin-bottom:48px;max-width:440px;}
.apply-checklist{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:18px;max-width:420px;}
.apply-checklist li{display:flex;align-items:flex-start;gap:12px;font-size:16px;color:rgba(249,248,245,.68);line-height:1.55;}
.apply-check-dot{width:18px;height:18px;border-radius:50%;background:rgba(232,160,48,.18);border:1px solid rgba(232,160,48,.3);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:1px;}
.apply-check-dot::after{content:'';width:5px;height:5px;border-radius:50%;background:var(--signal);}
.apply-cta{display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 24px;margin-top:32px;border-radius:14px;background:#F3EFE7;border:1px solid rgba(243,239,231,.88);color:var(--void);font-family:var(--sans);font-size:15px;font-weight:600;letter-spacing:-0.01em;text-decoration:none;transition:transform .24s var(--ease-mag),opacity .24s var(--ease-out),box-shadow .24s var(--ease-out);box-shadow:0 10px 24px rgba(0,0,0,.18);}
.apply-cta:hover{transform:scale(1.02);opacity:.96;}
.apply-cta:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(249,248,245,.18),0 10px 24px rgba(0,0,0,.18);}
.apply-cta:active{transform:scale(.98);}
.apply-cta-secondary{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;margin-top:12px;border-radius:10px;border:1px solid rgba(249,248,245,.18);background:transparent;color:rgba(249,248,245,.72);font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:-.01em;text-decoration:none;transition:color .18s var(--ease-out),background .18s var(--ease-out),border-color .18s var(--ease-out),transform .2s var(--ease-mag);}
.apply-cta-secondary:hover{color:var(--bg);background:rgba(249,248,245,.05);border-color:rgba(249,248,245,.28);transform:scale(1.02);}
.apply-cta-secondary:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(249,248,245,.14);}
.apply-cta-secondary:active{transform:scale(.98);}

/* Right panel — form column */
.apply-right{background:var(--void);padding:72px 56px 80px;display:flex;flex-direction:column;gap:0;border-left:1px solid rgba(249,248,245,.06);}
.apply-form-label{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(249,248,245,.56);margin-bottom:20px;display:block;}
.apply-form-card{background:#FFFFFF;border-radius:16px;border:1px solid rgba(226,221,214,.9);padding:28px 28px 20px;margin-bottom:16px;box-shadow:none;}
.apply-form-card iframe{display:block;}
.apply-form-hint{font-size:13px;color:rgba(249,248,245,.56);line-height:1.65;padding:0 2px;}

@media(max-width:900px){
  .apply-shell{grid-template-columns:1fr;}
  .apply-left{position:static;height:auto;padding:52px 32px 48px;}
  .apply-desc{max-width:100%;}
  .apply-right{padding:48px 32px 64px;}
}
@media(max-width:640px){
  .apply-nav{padding:0 20px;}
  .apply-left{padding:44px 24px 40px;}
  .apply-right{padding:40px 24px 56px;}
  .apply-form-card iframe{height:560px;}
}

/* VIDEO OVERLAY */
.video-overlay{position:fixed;inset:0;background:rgba(15,15,14,.88);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;}
.video-box{background:var(--void);border-radius:16px;width:100%;max-width:720px;overflow:hidden;position:relative;}
.video-box video{width:100%;display:block;}
.video-close{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.12);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.video-close:hover{background:rgba(255,255,255,.22);}

/* SCROLL ANIMATIONS */
[data-a]{opacity:0;transform:translateY(32px);transition:opacity .6s var(--ease-out),transform .6s var(--ease-out);}
[data-a="1"]{transition-delay:.1s;}
[data-a="2"]{transition-delay:.18s;}
[data-a="3"]{transition-delay:.26s;}
[data-a].in{opacity:1;transform:translateY(0);}

/* DEMO COMPONENTS */
.notif-scene{width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;}
.notif-phone{width:88px;height:156px;background:var(--void);border-radius:16px;position:relative;flex-shrink:0;}
.notif-screen{position:absolute;inset:4px;background:#1a1a18;border-radius:13px;}
.notif-pill{position:absolute;top:6px;left:50%;transform:translateX(-50%);width:28px;height:5px;background:#2a2a28;border-radius:3px;}
.notif-stack{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;}
.notif-toast{position:absolute;left:108px;right:0;background:var(--white);border:1px solid var(--border);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:3px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:opacity .25s,transform .25s;pointer-events:all;}
.notif-toast.exiting{opacity:0;transform:translateX(12px);}
.notif-app{font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);}
.notif-msg{font-size:11px;color:var(--ink);line-height:1.4;}
.notif-hint{text-align:center;font-size:10px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-top:8px;}
.bypass-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.bypass-phone{width:120px;height:200px;background:var(--void);border-radius:20px;position:relative;overflow:hidden;flex-shrink:0;}
.bypass-screen{position:absolute;inset:5px;background:#111;border-radius:16px;display:flex;align-items:center;justify-content:center;}
.bypass-modal{background:var(--white);border-radius:12px;width:88px;padding:12px 10px;text-align:center;display:flex;flex-direction:column;gap:8px;transition:opacity .2s,transform .2s;}
.bypass-modal.hidden{opacity:0;transform:scale(.95);pointer-events:none;}
.bypass-icon{font-size:18px;line-height:1;}
.bypass-title{font-size:9px;font-weight:700;color:var(--ink);letter-spacing:.02em;}
.bypass-sub{font-size:8px;color:var(--muted);line-height:1.4;}
.bypass-btn-ok{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:5px 0;font-size:8px;font-weight:600;color:var(--muted);cursor:pointer;width:100%;}
.bypass-btn-ignore{background:var(--signal);border:none;border-radius:6px;padding:5px 0;font-size:8px;font-weight:700;color:var(--void);cursor:pointer;width:100%;transition:background .15s;}
.bypass-btn-ignore:hover{background:var(--signal-dk);}
.bypass-success{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;opacity:0;transition:opacity .25s;}
.bypass-success.show{opacity:1;}
.bypass-success-icon{font-size:22px;}
.bypass-success-text{font-size:9px;color:rgba(255,255,255,.45);text-align:center;line-height:1.4;}
.minimal-phone{width:130px;height:210px;background:var(--void);border-radius:22px;position:relative;overflow:hidden;flex-shrink:0;}
.minimal-screen{position:absolute;inset:5px;background:#0d0d0c;border-radius:18px;padding:14px 10px 10px;display:flex;flex-direction:column;gap:0;}
.minimal-time{font-size:18px;font-weight:300;color:rgba(255,255,255,.9);text-align:center;letter-spacing:.02em;margin-bottom:12px;}
.minimal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.minimal-app{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;}
.minimal-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;transition:transform .15s;}
.minimal-app:active .minimal-icon{transform:scale(.9);}
.minimal-icon.unavail{opacity:.28;}
.minimal-app-name{font-size:7px;color:rgba(255,255,255,.5);text-align:center;}
.minimal-toast{position:absolute;bottom:10px;left:8px;right:8px;background:rgba(255,255,255,.08);border-radius:8px;padding:6px 8px;text-align:center;font-size:8px;color:rgba(255,255,255,.55);line-height:1.4;transition:opacity .3s;}
.minimal-toast.hide{opacity:0;}

@media(max-width:860px){
  .story-beat{grid-template-columns:1fr;gap:32px;}
  .story-beat.flip{direction:ltr;}
  .story-illus{display:none;}
  .about-grid{grid-template-columns:1fr;padding:0 24px;}
  .about-media{display:none;}
  .story-text h2,.story-text p,.about-text h2,.about-text p{max-width:100%;}
  .pricing-device{max-width:560px;margin:0 auto;}
}
@media(max-width:640px){
  #nav{padding:0 20px;}
  .nav-links{display:none;}
  .s-hero{padding:140px 24px 80px;}
  .wrap{padding:0 24px;}
  .story-beat,.faq-inner,.about-grid{padding:0 24px;}
  .site-footer{padding:64px 24px 40px;}
  .sub-nav{padding-left:24px;padding-right:24px;}
  .s,.s-faq,.s-about{padding:72px 0;}
  .pricing-shell{padding:0 20px;}
}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────

const ChevronIcon = () => (
  <svg className="chev" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── SHARED ───────────────────────────────────────────────────────────────────

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

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-btm">
          <span>© mutual. 2026</span>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── DEMO COMPONENTS ──────────────────────────────────────────────────────────

function NotificationProblemDemo() {
  const NOTIFS = [
    { app: 'Instagram', msg: 'Sarah liked your photo' },
    { app: 'Twitter',   msg: 'Breaking: Markets react to...' },
    { app: 'YouTube',   msg: 'New video from a channel you follow' },
    { app: 'Messages',  msg: 'Mum: Are you coming Sunday?' },
    { app: 'Reddit',    msg: 'Your post is trending in r/london' },
    { app: 'LinkedIn',  msg: '12 people viewed your profile' },
  ];
  const [visible, setVisible] = useState([]);
  const [exiting, setExiting] = useState([]);
  const nextId   = useRef(0);
  const queueRef = useRef(0);

  useEffect(() => {
    const add = () => {
      setVisible(v => {
        if (v.length >= 3) return v;
        const id    = nextId.current++;
        const notif = { ...NOTIFS[queueRef.current % NOTIFS.length], id };
        queueRef.current++;
        return [...v, notif];
      });
    };
    add();
    const t = setInterval(add, 2200);
    return () => clearInterval(t);
  }, []);

  const dismiss = (id) => {
    setExiting(e => [...e, id]);
    setTimeout(() => {
      setVisible(v => v.filter(n => n.id !== id));
      setExiting(e => e.filter(x => x !== id));
    }, 260);
  };

  return (
    <div className="story-illus" style={{padding:'24px 20px',flexDirection:'column',gap:0}}>
      <div className="notif-scene" style={{flex:1,position:'relative'}}>
        <div className="notif-phone">
          <div className="notif-screen"><div className="notif-pill" /></div>
        </div>
        <div className="notif-stack">
          {visible.map((n, i) => (
            <div
              key={n.id}
              className={`notif-toast${exiting.includes(n.id) ? ' exiting' : ''}`}
              style={{top:`${i * 56}px`}}
              onClick={() => dismiss(n.id)}
            >
              <span className="notif-app">{n.app}</span>
              <span className="notif-msg">{n.msg}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="notif-hint">tap to dismiss</p>
    </div>
  );
}

function BypassProblemDemo() {
  const [phase, setPhase] = useState('modal');
  const ignore = () => {
    setPhase('bypassed');
    setTimeout(() => setPhase('modal'), 2800);
  };
  return (
    <div className="story-illus" style={{padding:'24px 20px',flexDirection:'column',gap:10}}>
      <div className="bypass-wrap" style={{flex:1}}>
        <div className="bypass-phone">
          <div className="bypass-screen">
            <div className={`bypass-modal${phase === 'bypassed' ? ' hidden' : ''}`}>
              <div className="bypass-icon">⏳</div>
              <div className="bypass-title">Time Limit</div>
              <div className="bypass-sub">You've reached your limit on Instagram</div>
              <button className="bypass-btn-ok">OK</button>
              <button className="bypass-btn-ignore" onClick={ignore}>Ignore for today</button>
            </div>
            <div className={`bypass-success${phase === 'bypassed' ? ' show' : ''}`}>
              <div className="bypass-success-icon">📱</div>
              <div className="bypass-success-text">Limit ignored.<br />Back to scrolling.</div>
            </div>
          </div>
        </div>
      </div>
      <p style={{textAlign:'center',fontSize:'10px',color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase'}}>
        {phase === 'modal' ? 'try clicking ignore' : 'resets in a moment…'}
      </p>
    </div>
  );
}

function MinimalPhoneProblemDemo() {
  const [toast, setToast]               = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const timerRef = useRef(null);
  const APPS = [
    { name:'Call',     icon:'📞', color:'#2d6a4f', avail:true  },
    { name:'SMS',      icon:'💬', color:'#1b4332', avail:true  },
    { name:'Maps',     icon:'🗺️',  color:'#555',   avail:false },
    { name:'Uber',     icon:'🚗',  color:'#555',   avail:false },
    { name:'Banking',  icon:'🏦',  color:'#555',   avail:false },
    { name:'WhatsApp', icon:'💚',  color:'#555',   avail:false },
  ];
  const tap = (app) => {
    if (app.avail) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(`${app.name} not available`);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 1800);
  };
  return (
    <div className="story-illus" style={{padding:'24px 20px',flexDirection:'column',gap:8}}>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="minimal-phone">
          <div className="minimal-screen">
            <div className="minimal-time">09:41</div>
            <div className="minimal-grid">
              {APPS.map(app => (
                <div className="minimal-app" key={app.name} onClick={() => tap(app)}>
                  <div className={`minimal-icon${!app.avail ? ' unavail' : ''}`} style={{background: app.avail ? app.color : '#333'}}>
                    {app.icon}
                  </div>
                  <span className="minimal-app-name">{app.name}</span>
                </div>
              ))}
            </div>
            <div className={`minimal-toast${toastVisible ? '' : ' hide'}`}>{toast}</div>
          </div>
        </div>
      </div>
      <p style={{textAlign:'center',fontSize:'10px',color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase'}}>tap an app</p>
    </div>
  );
}

// ─── MAIN PAGE SECTIONS ───────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    id: "receive",
    title: "(01) Receive your phone",
    images: ["/1.png"],
    alt: "Phone delivery",
    fit: "contain",
    w: 360, h: 360, x: 70,  y: 34,
  },
  {
    id: "tell",
    title: "(02) Tell us your objective",
    images: ["/2a.png", "/2b.png", "/2c.png"],
    alt: "Your objective",
    fit: "contain",
    w: 352, h: 318, x: 494, y: 82,
  },
  {
    id: "look",
    title: "(03) We look at your data",
    images: ["/3.png"],
    alt: "Data analysis",
    fit: "contain",
    w: 330, h: 372, x: 972, y: 214,
  },
  {
    id: "rules",
    title: "(04) We set the rules together",
    images: ["/4a.png", "/4b.png"],
    alt: "Your rules",
    fit: "contain",
    w: 370, h: 338, x: 574, y: 506,
  },
  {
    id: "adjust",
    title: "(05) We adjust over time",
    images: ["/5.png"],
    alt: "Ongoing refinement",
    fit: "contain",
    w: 286, h: 338, x: 104, y: 472,
  },
];

function HowItWorksSection({ goApply, onWaitlist }) {
  const [stepImageIndexes, setStepImageIndexes] = useState(() =>
    Object.fromEntries(HOW_STEPS.map((step) => [step.id, 0]))
  );

  useEffect(() => {
    const rotatingSteps = HOW_STEPS.filter(
      (step) => (step.id === "tell" || step.id === "adjust" || step.id === "rules") && step.images.length > 1
    );
    const interval = setInterval(() => {
      setStepImageIndexes((current) => {
        const next = { ...current };
        rotatingSteps.forEach((step) => {
          const imageCount = step.images.length;
          if (imageCount > 1) {
            next[step.id] = ((current[step.id] ?? 0) + 1) % imageCount;
          }
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const setStepImageIndex = (stepId, nextIndex) => {
    setStepImageIndexes((current) => ({
      ...current,
      [stepId]: nextIndex,
    }));
  };

  return (
    <section className="s-howitworks" id="how-it-works">
      {/* Header sits above the composition frame */}
      <div className="hiw-header">
        <span className="label">How it works</span>
        <h2>You name the goal. <em className="hiw-em-orange">We build the system.</em></h2>
      </div>

      {/* Fixed 1440×880 composition frame */}
      <div className="hiw-frame">

        {/* SVG connector lines — z-index:1, behind all nodes */}
        <svg
          className="hiw-svg"
          viewBox="0 0 1440 880"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* receive → tell: right-center card1(410,200) → left-center card2(520,230) */}
          <path
            d="M410,200 C465,200 465,230 520,230"
            stroke="#9E9890" strokeWidth="1.5" opacity="0.45"
            strokeDasharray="4 7" fill="none" strokeLinecap="round"
          />
          {/* tell → look: right-center card2(820,230) → left-center card3(960,410) */}
          <path
            d="M820,230 C900,230 960,330 960,410"
            stroke="#9E9890" strokeWidth="1.5" opacity="0.45"
            strokeDasharray="4 7" fill="none" strokeLinecap="round"
          />
          {/* look → rules: bottom-center card3(1100,570) → right-center card5(930,670) */}
          <path
            d="M1100,570 C1100,645 1010,670 930,670"
            stroke="#9E9890" strokeWidth="1.5" opacity="0.45"
            strokeDasharray="4 7" fill="none" strokeLinecap="round"
          />
          {/* rules → adjust: left-center card5(610,670) → right-center card4(370,620) */}
          <path
            d="M610,670 C500,670 400,635 370,620"
            stroke="#9E9890" strokeWidth="1.5" opacity="0.45"
            strokeDasharray="4 7" fill="none" strokeLinecap="round"
          />
        </svg>

        {/* Nodes — transparent containers, absolutely positioned */}
        {HOW_STEPS.map((step) => {
          const activeIndex = stepImageIndexes[step.id] ?? 0;
          const hasCarousel = step.images.length > 1;
          return (
            <div
              key={step.id}
              className="hiw-node"
              style={{
                "--node-w": `${(step.w / 1440) * 100}%`,
                "--node-h": `${(step.h / 880) * 100}%`,
                "--node-x": `${(step.x / 1440) * 100}%`,
                "--node-y": `${(step.y / 880) * 100}%`,
              }}
            >
              <div className="hiw-node-label">
                <p className="hiw-node-title">{step.title}</p>
              </div>
              <div
                className="hiw-node-img"
              >
                {hasCarousel ? (
                  <div
                    className="hiw-node-track"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                    {step.images.map((image, index) => (
                      <div key={`${step.id}-${image}`} className="hiw-node-slide">
                        <img
                          src={image}
                          alt={`${step.alt} ${index + 1}`}
                          style={{
                            objectFit: step.fit,
                          }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={step.images[0]}
                    alt={step.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: step.fit,
                      display: "block",
                    }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
              </div>
              {hasCarousel && (
                <div className="hiw-node-dots" aria-label={`${step.title} image selector`}>
                  {step.images.map((_, index) => (
                    <button
                      key={`${step.id}-dot-${index}`}
                      type="button"
                      className={`hiw-node-dot${index === activeIndex ? " active" : ""}`}
                      aria-label={`Show ${step.title} image ${index + 1}`}
                      aria-pressed={index === activeIndex}
                      onClick={() => setStepImageIndex(step.id, index)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function scrollToHeroCta() {
  const el = document.querySelector('.hero-cta-input');
  if (el) { el.scrollIntoView({behavior:'smooth',block:'center'}); setTimeout(() => el.focus(), 600); }
}

function SectionWaitlistForm({ source, onSubmit }) {
  const inputRef = useRef();
  const [ok, setOk] = useState(false);
  const handle = async (e) => {
    e.preventDefault();
    await onSubmit(inputRef.current.value, source);
    setOk(true);
  };
  if (ok) {
    return (
      <div className="section-cta-ok">
        <svg viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        You're on the list. Redirecting…
      </div>
    );
  }
  return (
    <form className="section-cta-form" onSubmit={handle}>
      <input
        ref={inputRef}
        type="email"
        className="section-cta-input"
        placeholder="Email Address"
        required
      />
      <button type="submit" className="section-cta-btn">Join the waitlist</button>
    </form>
  );
}

const SPEC_TABS = [
  {
    id: 'details',
    label: 'Details',
    specs: [
      { label: 'Screen Size',       value: '6.7 inches' },
      { label: 'Storage & Memory',  value: '128 GB / 4 GB RAM' },
      { label: 'Camera',            value: '50 MP / 5 MP / 2 MP' },
      { label: 'Operating System',  value: 'Android' },
      { label: 'Brand',             value: 'Samsung · Quality & Reliability' },
      { label: 'Battery',           value: '5000 mAh' },
      { label: 'Durability',        value: 'IP54 · Gorilla Glass Victus' },
      { label: 'Security',          value: 'Fingerprint & Face Unlock' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    specs: [
      { label: 'CPU Speed',          value: '2.4 GHz, 2 GHz' },
      { label: 'CPU Type',           value: 'Octa-Core' },
      { label: 'Memory',             value: '4 GB RAM' },
      { label: 'Storage',            value: '128 GB (107.1 GB available)' },
      { label: 'External Storage',   value: 'MicroSD up to 2 TB' },
      { label: 'Dimensions',         value: '164.4 × 77.9 × 7.5 mm' },
      { label: 'Weight',             value: '192 g' },
    ],
  },
  {
    id: 'display',
    label: 'Display',
    specs: [
      { label: 'Display Size',     value: '6.7 inches' },
      { label: 'Resolution',       value: '1080 × 2340 (FHD+)' },
      { label: 'Technology',       value: 'Super AMOLED' },
      { label: 'Refresh Rate',     value: '90 Hz' },
      { label: 'Colour Depth',     value: '16M colours' },
    ],
  },
  {
    id: 'camera',
    label: 'Camera',
    specs: [
      { label: 'Rear Camera',     value: '50 MP + 5 MP + 2 MP' },
      { label: 'Rear Aperture',   value: 'f/1.8, f/2.2, f/2.4' },
      { label: 'OIS',             value: 'Yes' },
      { label: 'Rear Zoom',       value: 'Digital up to 10×' },
      { label: 'Front Camera',    value: '13 MP, f/2.0' },
      { label: 'Video',           value: 'FHD 1920 × 1080 @ 30 fps' },
      { label: 'Slow Motion',     value: '120 fps @ HD' },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    specs: [
      { label: 'SIM',       value: 'Dual Nano-SIM (4FF)' },
      { label: 'Networks',  value: '2G / 3G / 4G LTE / 5G Sub-6' },
      { label: 'Wi-Fi',     value: '802.11a/b/g/n/ac 2.4 GHz + 5 GHz' },
      { label: 'Bluetooth', value: 'v5.3' },
      { label: 'USB',       value: 'USB-C 2.0' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    specs: [
      { label: 'Battery',           value: '5000 mAh · non-removable' },
      { label: 'Video Playback',    value: 'Up to 18 hours' },
      { label: 'Sensors',           value: 'Accelerometer, Gyro, Fingerprint, Light, Geomagnetic' },
      { label: 'OS',                value: 'Android' },
      { label: 'Software Support',  value: 'Until August 2031' },
    ],
  },
];

function SpecTabs() {
  const [active, setActive] = useState('details');
  const tab = SPEC_TABS.find(t => t.id === active);
  return (
    <section className="s-specs">
      <div className="specs-shell">
        <div className="specs-header" data-a="">
          <span className="label">What you get</span>
          <h2>Samsung Galaxy A17 5G — <em>full specs.</em></h2>
        </div>
        <div className="spec-tab-bar" role="tablist">
          {SPEC_TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              className={`spec-tab${active === t.id ? ' active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="spec-grid" data-a="">
          {tab.specs.map(s => (
            <div key={s.label}>
              <p className="spec-item-label">{s.label}</p>
              <p className="spec-item-value">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PHONE_COLOURS = [
  { id: 'black', label: 'Black', swatch: '#1C1B19' },
  { id: 'grey',  label: 'Grey',  swatch: '#A8ADB3' },
  { id: 'blue',  label: 'Blue',  swatch: '#1E3A8A' },
];

function Pricing({ goLearnMore, goApply }) {
  const [colour, setColour] = useState('black');
  return (
    <section className="s-pricing" id="pricing">
      <div className="pricing-shell">
        <div className="pricing-panel">
          {/* Mobile-only headline — shown above phone on small screens */}
          <div className="pe-headline-mobile">
            <h2>Take control of your phone.<br /><span className="pe-orange">For 50p a day.</span></h2>
          </div>

          {/* Left: phone image */}
          <div className="pricing-media">
            <div className="pricing-device">
              <img src="/phones.png" alt="Mutual phone" />
            </div>
          </div>

          {/* Right: editorial free-floating content */}
          <div className="pricing-content">
            <div className="pe-content">

              {/* Headline */}
              <div className="pe-headline">
                <h2>Take control of your phone.<br /><span className="pe-orange">For 50p a day.</span></h2>
              </div>

              {/* Pricing */}
              <div className="pe-pricing">
                <div className="pe-price-row">
                  <span className="pe-price-now">$180</span>
                  <span className="pe-price-was">£240</span>
                </div>
                <p className="pe-price-note">Includes 1 year subscription. Batch 1 ships Q3 2026.</p>
                <p className="pe-refund">Fully refundable. Cancel anytime and we refund unused time.</p>
              </div>

              {/* Colour */}
              <div className="pe-colour">
                <p className="pe-colour-label">Colour</p>
                <div className="pe-colour-options" role="radiogroup" aria-label="Colour">
                  {PHONE_COLOURS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={colour === c.id}
                      className={`pe-colour-btn${colour === c.id ? ' active' : ''}`}
                      onClick={() => setColour(c.id)}
                    >
                      <span className="pe-swatch" style={{background: c.swatch}} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="pe-gap" />

              {/* What's included */}
              <p className="pe-includes-title">What&rsquo;s included</p>
              <ul className="pe-includes" role="list">
                <li className="pe-include-item">Samsung Galaxy A17 5G</li>
                <li className="pe-include-item">It follows your rules</li>
                <li className="pe-include-item">App access that changes with your day</li>
                <li className="pe-include-item">No bypass or deleting the blocker</li>
                <li className="pe-include-item">We adjust it with you</li>
              </ul>

              {/* CTA */}
              <div className="pe-cta">
                <a href={STRIPE_PREORDER} target="_blank" rel="noopener noreferrer" className="pe-btn-primary">Pre-order</a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [page,         setPage]         = useState('main');
  const [footerOk,     setFooterOk]     = useState(false);
  const [navWaitlistOk, setNavWaitlistOk] = useState(false);
  const [showVideo,    setShowVideo]    = useState(false);

  const footerEmailRef = useRef();
  const navEmailRef    = useRef();
  const heroRef        = useRef();
  const navRef         = useRef();

  const goPage  = (p) => { setPage(p); window.scrollTo({top:0,behavior:'instant'}); };
  const goApply = ()  => goPage('apply');
  const goMain  = ()  => goPage('main');

  useEffect(() => {
    if (page !== 'main') return;
    const hero = heroRef.current;
    const nav  = navRef.current;
    if (!hero || !nav) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        nav.classList.remove('scrolled');
        nav.classList.add('init');
      } else {
        nav.classList.remove('init');
        nav.classList.add('scrolled');
      }
    }, { threshold: 0.05 });
    io.observe(hero);
    return () => io.disconnect();
  }, [page]);

  useEffect(() => {
    const els = document.querySelectorAll('[data-a]');
    const io  = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data && e.data.type === 'tally-form-submitted') setShowVideo(true);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const saveEmail = async (email, source) => {
    await supabase.from('leads').insert({ contact: email, source });
  };

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    await saveEmail(footerEmailRef.current.value, 'footer');
    setFooterOk(true);
  };

  const handleNavWaitlistSubmit = async (e) => {
    e.preventDefault();
    await saveEmail(navEmailRef.current.value, 'nav-waitlist');
    setNavWaitlistOk(true);
    goPage('learn-more');
  };

  const heroEmailRef = useRef();
  const [heroOk, setHeroOk] = useState(false);
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    await saveEmail(heroEmailRef.current.value, 'hero-waitlist');
    setHeroOk(true);
    goPage('learn-more');
  };

  const handleSectionWaitlist = async (email, source) => {
    await saveEmail(email, source);
    setTimeout(() => goPage('learn-more'), 600);
  };

  const faqs = [
    { q: 'What happens to my current phone?',                 a: "You keep it. Most users keep their current device as a backup. You're not giving anything up." },
    { q: 'Can I still use WhatsApp, maps, and banking apps?', a: "Yes. It functions like a completely new phone. We only removes what you decide and when." },
    { q: 'Can I still download and delete apps?',             a: "Yes. You can download and delete anything freely, except the apps you specifically asked us to manage on your behalf." },
    { q: 'What if I want to change something?',               a: "You message us and we can make the adjustment. The friction is intentional, it keeps you accountable, but we want to make it work for you, not to be dogmatic about it." },
    { q: 'How long does this last?',                          a: "A few weeks. Enough time to actually feel a difference. After that, you decide whether to continue, adjust, or stop." },
    { q: "What if it's not working for me?",                  a: "That's exactly the feedback we need. We'll work with you to understand what's not working and adjust. If it's not for you, you can cancel anytime and we will refund you." },
  ];

  const SubNav = () => (
    <nav className="sub-nav">
      <div className="sub-nav-inner">
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); goMain(); }}>mutual.</a>
        <button className="btn-ghost" onClick={goMain}>← Back</button>
      </div>
    </nav>
  );

  const footer = (
    <SiteFooter />
  );

  return (
    <>
      <style>{css}</style>
      <div id="noise" aria-hidden="true" />


      {/* MAIN PAGE */}
      {page === 'main' && (
        <div id="page-main">
          <nav id="nav" className="init" ref={navRef}>
            <div className="nav-inner">
              <div className="nav-logo-group">
                <a className="logo logo-img" href="#" onClick={(e) => { e.preventDefault(); goMain(); }} aria-label="mutual.">
                  <img src="/logo.png" alt="mutual." />
                </a>
              </div>
              <div className="nav-launching">Early Access</div>
              <div className="nav-right">
                <a className="nav-learn-link" href="https://mutual.technology/about">Learn More</a>
                {navWaitlistOk ? (
                  <div className="nav-waitlist-ok">
                    <svg viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    You're on the list.
                  </div>
                ) : (
                  <div className="nav-waitlist">
                    <form className="nav-waitlist-form" onSubmit={handleNavWaitlistSubmit}>
                      <input
                        ref={navEmailRef}
                        type="email"
                        className="nav-waitlist-input"
                        placeholder="Join the waitlist"
                        onFocus={(e) => { e.target.placeholder = 'Email Address'; }}
                        onBlur={(e) => { if (!e.target.value) e.target.placeholder = 'Join the waitlist'; }}
                        required
                      />
                      <button type="submit" className="nav-waitlist-btn" aria-label="Submit">
                        <svg viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <section className="s-hero" id="hero" ref={heroRef}>
            <div className="hero-content">
              <h1 className="hero-h" data-a="">The first smartphone<br /><em>where you set the rules.</em></h1>
              <p className="hero-sub" data-a="1">You decide which apps you want and when.</p>
              <p className="hero-sub" data-a="1">We make sure it stays that way.</p>
              <div data-a="2" className="hero-cta-wrap">
                {heroOk ? (
                  <div className="hero-cta-ok">
                    <svg viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    You're in. Redirecting…
                  </div>
                ) : (
                  <form className="hero-cta-form" onSubmit={handleHeroSubmit}>
                    <input
                      ref={heroEmailRef}
                      type="email"
                      className="hero-cta-input"
                      placeholder="Email Address"
                      required
                    />
                    <button type="submit" className="hero-cta-btn">Join the waitlist</button>
                  </form>
                )}
              </div>
            </div>
          </section>

          <HowItWorksSection goApply={goApply} onWaitlist={handleSectionWaitlist} />
          <section className="s-action" id="see-it-in-action">
            <div className="action-header">
              <span className="label">See it in action</span>
            </div>
            <div className="action-grid">
              <div className="action-copy" data-a="">
                <h3 className="ar-title">Your rules</h3>
                <dl className="ar-rows">
                  <div className="ar-row">
                    <dt className="ar-label">Blocked apps</dt>
                    <dd className="ar-value">YouTube · X · Facebook · Reddit · Instagram · LinkedIn</dd>
                  </div>
                  <div className="ar-row">
                    <dt className="ar-label">Web access</dt>
                    <dd className="ar-value">Restricted. No browser workaround</dd>
                  </div>
                  <div className="ar-row">
                    <dt className="ar-label">Schedule</dt>
                    <dd className="ar-value">Starts at 3:25pm</dd>
                  </div>
                </dl>
                <div className="ar-divider" aria-hidden="true" />
                <h4 className="ar-subtitle">Unbypassable</h4>
                <p className="ar-state">No access. No workarounds.</p>
                <p className="ar-foot">Keep everything else</p>
              </div>
              <div className="action-media" data-a="1">
                <video
                  src="/mdm-demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            </div>
            <div className="section-cta-wrap">
              <SectionWaitlistForm source="action-waitlist" onSubmit={handleSectionWaitlist} />
            </div>
          </section>
          <section className="s-about">
            <div className="about-grid">
              <div className="about-text" data-a="">
                <span className="label">About</span>
                <h2>Built from a simple frustration.</h2>
                <p>Smartphone overuse is the most documented, least solved problem in consumer technology. We have tried most solutions out there, but they either ask you to rely on willpower or take away too much. We think that's the wrong approach.</p>
                <p>We're two founders building in London. We're looking for the right people to build this with.</p>
              </div>
              <div className="about-headshots" data-a="1">
                <div className="headshot">
                  <img src="/joao.jpg" alt="João" style={{objectPosition:'center 22%'}} />
                </div>
                <div className="headshot">
                  <img src="/ali.jpg" alt="Ali" style={{objectPosition:'center 30%'}} />
                </div>
              </div>
            </div>
          </section>
          {footer}
        </div>
      )}

      {showVideo && (
        <div className="video-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-box" onClick={e => e.stopPropagation()}>
            <button className="video-close" onClick={() => setShowVideo(false)}>✕</button>
            <video src="/BetaIntroVideo.mp4" controls autoPlay style={{width:'100%',display:'block'}} />
          </div>
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
          <div className="apply-shell">

            {/* ── Left: context + deposit ── */}
            <div className="apply-left">
              <div className="apply-left-top">
                <span className="apply-eyebrow">Early access</span>
                <h1 className="apply-h">Apply<br /><em>Second Cohort.</em></h1>
                <p className="apply-desc">Answer a few short questions. If you're a fit, we'll confirm your spot and send next steps.</p>
                <ul className="apply-checklist">
                  <li><span className="apply-check-dot" /><span>Takes about 2 minutes</span></li>
                  <li><span className="apply-check-dot" /><span>No commitment until you pay</span></li>
                  <li><span className="apply-check-dot" /><span>Get a refund or roll over if you're not selected</span></li>
                </ul>
                <a href={STRIPE_PREORDER} target="_blank" rel="noopener noreferrer" className="apply-cta">
                Pre-order
                </a>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="apply-right">
              <span className="apply-form-label">Your application</span>
              <div className="apply-form-card">
                <iframe
                  src="https://tally.so/embed/RGRWGK?alignLeft=1&hideTitle=1&transparentBackground=0&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="387"
                  frameBorder="0"
                  title="mutual. Early Access Application"
                />
              </div>
              
            </div>

          </div>
        </div>
      )}

      {/* WHY MUTUAL PAGE */}
      {page === 'why' && (
        <div id="page-why">
          <SubNav />
          <section className="s-about">
            <div className="about-grid">
              <div className="about-text" data-a="">
                <span className="label">About</span>
                <h2>Built from a simple frustration.</h2>
                <p>Smartphone overuse is the most documented, least solved problem in consumer technology. We have tried most solutions out there, but they either ask you to rely on willpower or take away too much. We think that's the wrong approach.</p>
                <p>We're two founders building in London. We're looking for the right people to build this with.</p>
              </div>
              <div className="about-media" data-a="1">
                <div className="about-photo">
                  <img src="https://placehold.co/800x600" alt="João and Ali" />
                </div>
              </div>
            </div>
          </section>

          {footer}
        </div>
      )}

      {/* LEARN MORE PAGE */}
      {page === 'learn-more' && (
        <div id="page-learn-more">
          <SubNav />
          <section className="lm-banner">
            <div className="lm-banner-inner">
              <h1><em>Pre-order now.</em></h1>
            </div>
          </section>
          {/* Pricing section — exact copy */}
          <Pricing />
          {/* Divider */}
          <div style={{padding:'0 40px'}}><div className="lm-divider" /></div>
          {/* Spec tabs */}
          <SpecTabs />
          {/* FAQ */}
          <section className="s-faq" id="faqs">
            <div className="faq-inner">
              <h2 data-a="">Frequently asked questions</h2>
              <div>
                {faqs.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} />)}
              </div>
            </div>
          </section>
          {footer}
        </div>
      )}

      {/* FAQ PAGE */}
      {page === 'faq' && (
        <div id="page-faq">
          <SubNav />
          <section className="s-faq">
            <div className="faq-inner">
              <h2 data-a="">Frequently asked questions</h2>
              <div>
                {faqs.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} />)}
              </div>
            </div>
          </section>
          {footer}
        </div>
      )}
    </>
  );
}
