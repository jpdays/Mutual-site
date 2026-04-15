import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jcgelvlzwfearecpoaxg.supabase.co",
  "sb_publishable_dlyG3pjDXQwPt7XRSIsxgA_tN-PItUj"
);

const STRIPE_LINK = "https://buy.stripe.com/bJeaEP6cO13LfKF0EBgMw02";

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

.s-statement{padding:40px 0 0;}
.statement-inner{max-width:640px;margin:0 auto;padding:0 40px;text-align:center;}
.statement-inner h2{font-size:clamp(26px,3vw,40px);margin-bottom:20px;color:var(--ink);}

/* ─── ADAPTS TO YOUR LIFE ─── */
.s-adapts{padding:112px 0 96px;background:var(--bg);}
.adapts-wrap{max-width:1080px;margin:0 auto;padding:0 40px;}
.adapts-hdr{margin-bottom:56px;}
.adapts-eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:block;}
.adapts-h{font-family:var(--sans);font-size:clamp(28px,3.8vw,44px);font-weight:600;letter-spacing:-0.03em;color:var(--ink);line-height:1.1;margin:0;}
.adapts-h em{font-family:var(--serif);font-style:italic;font-weight:400;}
.adapts-grid{display:grid;grid-template-columns:420px 1fr;gap:64px;align-items:start;}
.adapts-panel{background:var(--white);border:1px solid var(--border);border-radius:28px;padding:36px;box-shadow:0 8px 40px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);}
.adapts-moments{display:flex;flex-direction:column;gap:6px;margin-bottom:32px;}
.adapts-btn{background:none;border:1.5px solid transparent;border-radius:100px;padding:10px 20px;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--muted);cursor:pointer;text-align:left;letter-spacing:-0.01em;transition:color 200ms cubic-bezier(0.25,0.46,0.45,0.94),background 200ms cubic-bezier(0.25,0.46,0.45,0.94),border-color 200ms cubic-bezier(0.25,0.46,0.45,0.94),transform 200ms cubic-bezier(0.25,0.46,0.45,0.94),box-shadow 200ms cubic-bezier(0.25,0.46,0.45,0.94);user-select:none;}
.adapts-btn:hover{color:var(--ink);background:var(--surface);transform:translateY(-1px) scale(1.02);}
.adapts-btn:active{transform:scale(0.98);}
.adapts-btn.active{color:var(--ink);background:var(--surface);border-color:var(--border);font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.06);}
.adapts-divider{height:1px;background:var(--border);margin-bottom:28px;}
.adapts-fade{transition:opacity 180ms ease,transform 180ms ease;}
.adapts-fade.out{opacity:0;transform:translateY(8px);}
.adapts-dyn-title{font-family:var(--sans);font-size:18px;font-weight:600;letter-spacing:-0.025em;color:var(--ink);line-height:1.3;margin:0 0 10px;}
.adapts-dyn-body{font-family:var(--sans);font-size:14px;color:var(--muted);line-height:1.7;margin:0 0 3px;letter-spacing:-0.005em;}
.adapts-tag{display:inline-flex;align-items:center;gap:6px;margin-top:20px;padding:5px 12px;background:var(--surface);border:1px solid var(--border);border-radius:100px;font-family:var(--sans);font-size:11px;font-weight:500;color:var(--muted);letter-spacing:.04em;}
.adapts-tag-dot{width:5px;height:5px;border-radius:50%;background:var(--signal);flex-shrink:0;}
.adapts-image-outer{background:var(--white);border:1px solid var(--border);border-radius:28px;box-shadow:0 8px 40px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);overflow:hidden;aspect-ratio:4/3;position:relative;transition:opacity 180ms ease,transform 180ms ease;}
.adapts-image-outer.out{opacity:0;transform:translateY(8px);}
.adapts-img-inner{position:absolute;inset:0;display:flex;flex-direction:column;padding:32px;gap:16px;}
.adapts-ph-bar{border-radius:100px;background:var(--surface);border:1px solid var(--border);}
.adapts-ph-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:4px;}
.adapts-ph-chip{border-radius:12px;aspect-ratio:1;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;transition:opacity .22s,filter .22s;}
.adapts-ph-chip.dim{opacity:.18;filter:grayscale(1);}
.adapts-rule-row{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:12px;}
.adapts-rule-dot{width:7px;height:7px;border-radius:50%;background:var(--signal);flex-shrink:0;box-shadow:0 0 5px rgba(232,160,48,.5);}
.adapts-rule-text{font-family:var(--sans);font-size:12px;font-weight:500;color:var(--ink);letter-spacing:-.01em;flex:1;}
.adapts-rule-tag{font-family:var(--sans);font-size:10px;color:var(--muted);background:var(--border);border-radius:100px;padding:2px 8px;white-space:nowrap;}
.adapts-bottom{font-family:var(--sans);font-size:13px;color:var(--muted);text-align:center;margin-top:56px;opacity:.65;letter-spacing:-.005em;}
@media(max-width:860px){
  .adapts-grid{grid-template-columns:1fr;gap:32px;}
  .adapts-image-outer{aspect-ratio:3/2;}
}

/* ─── HOW MUTUAL WORKS ─── */
.s-product{padding:96px 0;}
.product-inner{max-width:1080px;margin:0 auto;padding:0 40px;}
.product-hdr{margin-bottom:52px;}
.product-hdr h2{font-size:clamp(28px,3.5vw,44px);letter-spacing:-0.025em;margin-bottom:8px;}
.product-hdr p{font-size:15px;color:var(--muted);max-width:480px;}
.product-layout{display:grid;grid-template-columns:1fr 1.5fr;gap:56px;align-items:start;}
.product-steps{display:flex;flex-direction:column;}
.product-step{display:flex;align-items:flex-start;gap:16px;padding:18px 0;cursor:pointer;border-top:1px solid var(--border);user-select:none;}
.product-step:last-child{border-bottom:1px solid var(--border);}
.product-step-num{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--muted);flex-shrink:0;transition:background .25s,border-color .25s,color .25s;}
.product-step.active .product-step-num{background:var(--signal);border-color:var(--signal);color:var(--void);}
.product-step-body{flex:1;padding-top:5px;}
.product-step-title{font-size:15px;font-weight:500;color:var(--muted);letter-spacing:-0.01em;line-height:1.3;transition:color .25s;display:block;}
.product-step.active .product-step-title{color:var(--ink);}
.product-step-bar{height:2px;background:var(--border);border-radius:2px;margin-top:12px;overflow:hidden;}
.product-step-fill{height:100%;background:var(--signal);border-radius:2px;transition:width 40ms linear;}
.product-panel{background:var(--signal);border-radius:24px;padding:48px 32px;display:flex;align-items:center;justify-content:center;min-height:460px;position:sticky;top:120px;}
.product-phone{width:170px;background:var(--void);border-radius:32px;aspect-ratio:9/19.5;position:relative;overflow:hidden;box-shadow:0 28px 56px rgba(0,0,0,.25);}
.product-phone::before{content:'';position:absolute;top:10px;left:50%;transform:translateX(-50%);width:36px;height:5px;background:rgba(255,255,255,.08);border-radius:3px;z-index:2;}
.product-phone-screen{position:absolute;inset:3px;background:#111;border-radius:30px;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.product-phone-screen img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .2s;}
.product-phone-num{position:absolute;font-family:var(--serif);font-style:italic;font-size:52px;color:rgba(255,255,255,.07);pointer-events:none;}

/* ─── JOIN EARLY ACCESS PROCESS ─── */
.s-process{padding:96px 0;}
.process-inner{max-width:1080px;margin:0 auto;padding:0 40px;}
.process-hdr{margin-bottom:52px;}
.process-hdr h2{font-size:clamp(26px,3vw,38px);letter-spacing:-0.025em;margin-bottom:8px;}
.process-hdr p{font-size:15px;color:var(--muted);}
.process-track{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.process-line{position:absolute;top:26px;left:12.5%;right:12.5%;border-top:1.5px dashed var(--border);z-index:0;pointer-events:none;}
.process-card{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:28px 22px 24px;position:relative;z-index:1;transition:border-color .2s,box-shadow .2s;}
.process-card:hover{border-color:rgba(232,160,48,.4);box-shadow:0 4px 16px rgba(0,0,0,.06);}
.process-num{font-family:var(--serif);font-style:italic;font-size:26px;color:var(--border);line-height:1;margin-bottom:18px;}
.process-card-title{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:6px;letter-spacing:-0.01em;line-height:1.3;}
.process-card-desc{font-size:13px;color:var(--muted);line-height:1.65;}

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

.founders{display:flex;gap:48px;justify-content:flex-start;margin-top:32px;}
.founder{display:flex;flex-direction:column;align-items:center;gap:10px;}
.founder-circle{width:100px;height:100px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);overflow:hidden;}
.founder-circle img{width:100%;height:100%;object-fit:cover;}
.founder-name{font-size:13px;font-weight:500;color:var(--ink);letter-spacing:-.01em;}

.card-deck{position:relative;width:100%;aspect-ratio:3/2;cursor:pointer;}
.deck-card{position:absolute;inset:0;background:var(--white);border-radius:12px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;transition:transform .4s cubic-bezier(0.34,1.56,0.64,1),filter .4s,opacity .4s;}
.deck-card img{width:100%;height:100%;object-fit:cover;display:block;}
.deck-card.behind-1{transform:translateY(10px) scale(0.95);filter:blur(2px);opacity:.7;z-index:1;}
.deck-card.behind-2{transform:translateY(18px) scale(0.9);filter:blur(4px);opacity:.45;z-index:0;}
.deck-card.front{transform:translateY(0) scale(1);filter:none;opacity:1;z-index:2;}
.deck-hint{position:absolute;bottom:-24px;left:0;right:0;text-align:center;font-size:11px;color:var(--muted);letter-spacing:.06em;}

.apply-nav{background:var(--bg);border-bottom:1px solid var(--border);padding:0 40px;position:sticky;top:0;z-index:100;}
.apply-nav-inner{max-width:720px;margin:0 auto;height:62px;display:flex;align-items:center;justify-content:space-between;}
.apply-body{max-width:720px;margin:0 auto;padding:72px 40px 96px;}
.apply-body h1{font-size:clamp(28px,4vw,46px);letter-spacing:-0.03em;line-height:1.1;margin-bottom:14px;}
.apply-body h1 em{font-family:var(--serif);font-style:italic;font-weight:400;}
.apply-sub{font-size:15px;color:var(--muted);line-height:1.8;margin-bottom:48px;max-width:480px;}
.tally-card{background:var(--white);border-radius:16px;border:1px solid var(--border);padding:36px;margin-bottom:18px;}
.deposit-card{background:var(--surface);border-radius:10px;border:1px solid var(--border);padding:18px 22px;font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:24px;}

.stripe-section{text-align:center;padding:36px;background:var(--white);border-radius:16px;border:1px solid var(--border);}
.stripe-section p{font-size:14px;color:var(--muted);margin-bottom:20px;line-height:1.7;}
.btn-stripe{display:inline-flex;align-items:center;gap:10px;background:var(--void);color:var(--bg);border:none;border-radius:100px;padding:14px 32px;font-family:var(--sans);font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;transition:background .2s,transform .15s;}
.btn-stripe:hover{background:#262624;transform:scale(1.02);}

.video-overlay{position:fixed;inset:0;background:rgba(15,15,14,.88);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;}
.video-box{background:var(--void);border-radius:16px;width:100%;max-width:720px;overflow:hidden;position:relative;}
.video-box video{width:100%;display:block;}
.video-close{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.12);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.video-close:hover{background:rgba(255,255,255,.22);}

[data-a]{opacity:0;transform:translateY(32px);transition:opacity .6s var(--ease-out),transform .6s var(--ease-out);}
[data-a="1"]{transition-delay:.1s;}
[data-a="2"]{transition-delay:.18s;}
[data-a="3"]{transition-delay:.26s;}
[data-a].in{opacity:1;transform:translateY(0);}

.story-illus{position:relative;overflow:hidden;}

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
  .story-text h2,.story-text p{max-width:100%;}
  .about-text h2,.about-text p{max-width:100%;}
  .product-layout{grid-template-columns:1fr;}
  .product-panel{display:none;}
  .process-track{grid-template-columns:1fr 1fr;}
  .process-line{display:none;}
}
@media(max-width:640px){
  #topBar{padding:8px 20px;}
  .tb-label{display:none;}
  .tb{justify-content:center;}
  #nav{padding:0 20px;}
  .nav-links{display:none;}
  .s-hero{padding:140px 24px 80px;}
  .wrap,.wrap-narrow,.wrap-mid{padding:0 24px;}
  .story-beat,.faq-inner,.statement-inner,.product-inner,.process-inner{padding:0 24px;}
  .site-footer{padding:64px 24px 40px;}
  .tally-card{padding:24px 20px;}
  .apply-nav,.apply-body{padding-left:24px;padding-right:24px;}
  .s-ea{padding:80px 24px;}
  .s,.s-product,.s-process,.s-faq,.s-about,.s-statement{padding:72px 0;}
  .process-track{grid-template-columns:1fr;}
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

function CardDeck({ images }) {
  const [order, setOrder] = useState([0, 1, 2]);
  const advance = () => {
    setOrder(prev => {
      const next = [...prev];
      next.push(next.shift());
      return next;
    });
  };
  const getClass = (pos) => {
    if (pos === 0) return 'deck-card front';
    if (pos === 1) return 'deck-card behind-1';
    return 'deck-card behind-2';
  };
  return (
    <div style={{position:'relative',paddingBottom:'32px'}}>
      <div className="card-deck" onClick={advance}>
        {order.map((imgIdx, pos) => (
          <div key={imgIdx} className={getClass(pos)}>
            <img src={images[imgIdx]} alt={`Example ${imgIdx + 1}`} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
        ))}
      </div>
      <p className="deck-hint">TAP TO SEE MORE</p>
    </div>
  );
}

function NotificationProblemDemo() {
  const NOTIFS = [
    { app: 'Instagram', msg: 'Sarah liked your photo' },
    { app: 'Twitter', msg: 'Breaking: Markets react to...' },
    { app: 'YouTube', msg: 'New video from a channel you follow' },
    { app: 'Messages', msg: 'Mum: Are you coming Sunday?' },
    { app: 'Reddit', msg: 'Your post is trending in r/london' },
    { app: 'LinkedIn', msg: '12 people viewed your profile' },
  ];
  const [visible, setVisible] = useState([]);
  const [exiting, setExiting] = useState([]);
  const nextId = useRef(0);
  const queueRef = useRef(0);

  useEffect(() => {
    const add = () => {
      setVisible(v => {
        if (v.length >= 3) return v;
        const id = nextId.current++;
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
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const timerRef = useRef(null);

  const APPS = [
    { name: 'Call',     icon: '📞', color: '#2d6a4f', avail: true },
    { name: 'SMS',      icon: '💬', color: '#1b4332', avail: true },
    { name: 'Maps',     icon: '🗺️',  color: '#555',   avail: false },
    { name: 'Uber',     icon: '🚗',  color: '#555',   avail: false },
    { name: 'Banking',  icon: '🏦',  color: '#555',   avail: false },
    { name: 'WhatsApp', icon: '💚',  color: '#555',   avail: false },
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

const ATYL_MOMENTS = [
  {
    id: 'work', label: 'During work',
    title: 'Stay focused during work',
    body: ['Work apps stay accessible. Everything else is locked away.', 'No decisions, no willpower needed.'],
    descriptor: 'Apps · Notifications · Time (9am–5pm)',
    ruleLabel: 'Focus mode active',
    apps: [
      { icon: '💬', on: true  }, { icon: '📧', on: true  },
      { icon: '📅', on: true  }, { icon: '🗺️', on: true  },
      { icon: '📸', on: false }, { icon: '🎵', on: false },
      { icon: '▶️', on: false }, { icon: '🐦', on: false },
    ],
  },
  {
    id: 'night', label: 'At night',
    title: 'Wind down without distractions',
    body: ['Your phone quiets down. Notifications stop.', 'Only what matters gets through.'],
    descriptor: 'Notifications · Time · Reduced interruptions',
    ruleLabel: 'Night mode active',
    apps: [
      { icon: '⏰', on: true  }, { icon: '🎵', on: true  },
      { icon: '📖', on: true  }, { icon: '💬', on: false },
      { icon: '📧', on: false }, { icon: '📸', on: false },
      { icon: '▶️', on: false }, { icon: '🎵', on: false },
    ],
  },
  {
    id: 'home', label: 'At home',
    title: 'Use your phone more intentionally at home',
    body: ['No endless scrolling. Just the apps you actually need.'],
    descriptor: 'Apps · Location · Home',
    ruleLabel: 'Home rules active',
    apps: [
      { icon: '💬', on: true  }, { icon: '🗺️', on: true  },
      { icon: '🎵', on: true  }, { icon: '📧', on: true  },
      { icon: '🎵', on: false }, { icon: '🐦', on: false },
      { icon: '▶️', on: false }, { icon: '📸', on: false },
    ],
  },
  {
    id: 'out', label: 'Out and about',
    title: "Stay present when you're outside",
    body: ["Only essentials stay. No distractions while you're out."],
    descriptor: 'Apps · Location · Outside',
    ruleLabel: 'Outside rules active',
    apps: [
      { icon: '🗺️', on: true  }, { icon: '💬', on: true  },
      { icon: '📞', on: true  }, { icon: '💳', on: true  },
      { icon: '📸', on: false }, { icon: '🎵', on: false },
      { icon: '💬', on: false }, { icon: '▶️', on: false },
    ],
  },
  {
    id: 'weekend', label: 'Weekend',
    title: 'Let your phone adapt to your week',
    body: ['Different rules for different days. Built around your routine.'],
    descriptor: 'Apps · Days · Weekend',
    ruleLabel: 'Weekend mode active',
    apps: [
      { icon: '💬', on: true }, { icon: '🗺️', on: true },
      { icon: '🎵', on: true }, { icon: '🖼️', on: true },
      { icon: '📸', on: true }, { icon: '▶️', on: true },
      { icon: '💬', on: false }, { icon: '📧', on: false },
    ],
  },
];

function AdaptsToYourLife() {
  const [active, setActive] = useState('work');
  const [fading, setFading] = useState(false);
  const m = ATYL_MOMENTS.find(x => x.id === active);

  const select = (id) => {
    if (id === active) return;
    setFading(true);
    setTimeout(() => { setActive(id); setFading(false); }, 180);
  };

  return (
    <section className="s-adapts">
      <div className="adapts-wrap">

        {/* Header */}
        <div className="adapts-hdr" data-a="">
          <span className="adapts-eyebrow">Adapts to your life</span>
          <h2 className="adapts-h">
            Your rules, built around{' '}
            <em>how you actually live.</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="adapts-grid" data-a="1">

          {/* LEFT — surface card */}
          <div className="adapts-panel">
            {/* Moment buttons */}
            <div className="adapts-moments">
              {ATYL_MOMENTS.map(x => (
                <button
                  key={x.id}
                  className={`adapts-btn${active === x.id ? ' active' : ''}`}
                  onClick={() => select(x.id)}
                >
                  {x.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="adapts-divider" />

            {/* Dynamic text */}
            <div className={`adapts-fade${fading ? ' out' : ''}`}>
              <h3 className="adapts-dyn-title">{m.title}</h3>
              {m.body.map((line, i) => (
                <p key={i} className="adapts-dyn-body">{line}</p>
              ))}
              <div className="adapts-tag">
                <span className="adapts-tag-dot" />
                {m.descriptor}
              </div>
            </div>
          </div>

          {/* RIGHT — grounded image placeholder */}
          <div className={`adapts-image-outer${fading ? ' out' : ''}`}>
            <div className="adapts-img-inner">
              {/* Top bar */}
              <div className="adapts-ph-bar" style={{ height: 36, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
                <div className="adapts-rule-dot" />
                <span className="adapts-rule-text">{m.ruleLabel}</span>
                <span className="adapts-rule-tag">{m.id === 'work' ? '9am–5pm' : m.id === 'night' ? 'After 10pm' : m.id === 'weekend' ? 'Sat–Sun' : 'Active now'}</span>
              </div>

              {/* App grid */}
              <div className="adapts-ph-grid">
                {m.apps.map((app, i) => (
                  <div key={i} className={`adapts-ph-chip${!app.on ? ' dim' : ''}`}>
                    {app.icon}
                  </div>
                ))}
              </div>

              {/* Bottom rule rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                <div className="adapts-rule-row">
                  <div className="adapts-rule-dot" />
                  <span className="adapts-rule-text">{m.descriptor.split(' · ')[0]} rules enforced</span>
                  <span className="adapts-rule-tag">on</span>
                </div>
                <div className="adapts-rule-row" style={{ opacity: 0.45 }}>
                  <div className="adapts-rule-dot" style={{ background: 'var(--border)', boxShadow: 'none' }} />
                  <span className="adapts-rule-text" style={{ color: 'var(--muted)' }}>No overrides available</span>
                  <span className="adapts-rule-tag">locked</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <p className="adapts-bottom">
          Mix apps, notifications, websites, time, location, and days — however you want.
        </p>

      </div>
    </section>
  );
}

function HowMutualWorks() {
  const STEPS = [
    { n: 1, title: 'Choose your apps', desc: 'Select which apps Mutual will manage. Everything else stays exactly as it was.' },
    { n: 2, title: 'Schedule your rules', desc: 'Set time-based rules for each app. No Instagram after 9pm. No YouTube on weekday mornings. You decide.' },
    { n: 3, title: 'Define location rules', desc: 'Your phone adapts to where you are. Different rules for home, work, and everywhere else.' },
    { n: 4, title: 'Confirm and commit', desc: 'Lock in your configuration. You choose how long it holds before we review together.' },
    { n: 5, title: 'We adjust together', desc: "We check in to see what's working. If something isn't landing, we adjust the plan — together." },
  ];

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const stateRef = useRef({ active: 0, progress: 0 });

  const jumpTo = (i) => {
    stateRef.current.active = i;
    stateRef.current.progress = 0;
    setActive(i);
    setProgress(0);
  };

  useEffect(() => {
    const DURATION = 5000;
    const TICK = 40;
    const interval = setInterval(() => {
      stateRef.current.progress += (TICK / DURATION) * 100;
      if (stateRef.current.progress >= 100) {
        stateRef.current.progress = 0;
        stateRef.current.active = (stateRef.current.active + 1) % STEPS.length;
        setActive(stateRef.current.active);
      }
      setProgress(stateRef.current.progress);
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="s-product" id="how-it-works">
      <div className="product-inner">
        <div className="product-hdr" data-a="">
          <h2>How Mutual works</h2>
          <p>A phone configured around what you actually want from it — and held there.</p>
        </div>
        <div className="product-layout">
          <div className="product-steps">
            {STEPS.map((step, i) => (
              <div key={i} className={`product-step${active === i ? ' active' : ''}`} onClick={() => jumpTo(i)}>
                <div className="product-step-num">{step.n}</div>
                <div className="product-step-body">
                  <span className="product-step-title">{step.title}</span>
                  {active === i && (
                    <div className="product-step-bar">
                      <div className="product-step-fill" style={{width:`${progress}%`}} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="product-panel">
            <div className="product-phone">
              <div className="product-phone-screen">
                <img
                  key={active}
                  src={`/hiw-${active + 1}.png`}
                  alt={STEPS[active].title}
                  style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="product-phone-num">{active + 1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinEarlyAccess() {
  const CARDS = [
    { n: '1', title: 'Apply to early access', desc: 'Fill out a short application. We read every one personally.' },
    { n: '2', title: 'We review and confirm', desc: 'If you are a fit, we confirm your spot and send next steps within 48 hours.' },
    { n: '3', title: 'Your phone arrives', desc: 'A pre-configured Samsung device arrives at your door, ready to go.' },
    { n: '4', title: 'You use it, we adjust', desc: 'We check in regularly and refine the configuration together until it sticks.' },
  ];

  return (
    <section className="s-process" id="join">
      <div className="process-inner">
        <div className="process-hdr" data-a="">
          <h2>How to join</h2>
          <p>Early access is selective. Here is what happens after you apply.</p>
        </div>
        <div className="process-track" data-a="1">
          <div className="process-line" />
          {CARDS.map((card, i) => (
            <div key={i} className="process-card">
              <div className="process-num">{card.n}</div>
              <div className="process-card-title">{card.title}</div>
              <div className="process-card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState('main');
  const [tbOk, setTbOk] = useState(false);
  const [footerOk, setFooterOk] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const tbEmailRef = useRef();
  const footerEmailRef = useRef();
  const heroRef = useRef();
  const navRef = useRef();
  const topBarRef = useRef();

  const goApply = () => { setPage('apply'); window.scrollTo({top:0,behavior:'instant'}); };
  const goMain  = () => { setPage('main');  window.scrollTo({top:0,behavior:'instant'}); };

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

  const handleTbSubmit = async (e) => {
    e.preventDefault();
    await saveEmail(tbEmailRef.current.value, 'topbar');
    setTbOk(true);
  };

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    await saveEmail(footerEmailRef.current.value, 'footer');
    setFooterOk(true);
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

      {page === 'main' && (
        <div id="page-main">

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

          <section className="s-hero" id="hero" ref={heroRef}>
            <div className="hero-content">
              <h1 className="hero-h" data-a="">The first smartphone<br />that <em>enforces your rules.</em></h1>
              <p className="hero-sub" data-a="1">You decide which apps you want and when. The phone makes sure it stays that way.</p>
              <div data-a="2">
                <button className="btn btn-void btn-lg" onClick={goApply}>Request Early Access →</button>
              </div>
            </div>
          </section>

          <AdaptsToYourLife />

          <HowMutualWorks />

          <section className="s" id="why">
            <div className="story-beat" data-a="">
              <div className="story-text">
                <span className="label">The problem</span>
                <h2>Smartphones are affecting our sleep, focus and attention span.</h2>
                <p>The apps are designed by people whose job is to keep you there. You're fighting a billion-dollar engagement machine.</p>
                <p>Current solutions are not up to the task.</p>
              </div>
              <NotificationProblemDemo />
            </div>
          </section>

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
              <BypassProblemDemo />
            </div>
          </section>

          <section className="s">
            <div className="story-beat" data-a="">
              <div className="story-text">
                <span className="label">Why dumb or minimal phones fail</span>
                <h2>A minimal phone solves distraction by removing everything.</h2>
                <p>No TikTok, but also no Uber, no banking apps, no boarding pass, no WhatsApp.</p>
                <p>Most people who try it come back. Because modern life requires a modern phone.</p>
              </div>
              <MinimalPhoneProblemDemo />
            </div>
          </section>

          <JoinEarlyAccess />

          <section className="s-ea" id="early-access">
            <div data-a="">
              <span className="label-lt">Early access</span>
              <h2>We're accepting the first <em>20 users.</em></h2>
              <p className="ea-body">We are reviewing applications to join our platform and look forward to welcoming you soon.</p>
              <button className="btn btn-signal btn-lg" onClick={goApply}>Apply Now →</button>
              <p className="ea-note">£10 deposit confirms your spot. Full refund if not selected, or roll to the next cohort.</p>
            </div>
          </section>

          <section className="s-about" id="about">
            <div className="about-grid">
              <div className="about-text" data-a="">
                <span className="label">About</span>
                <h2>Built from a simple frustration.</h2>
                <p>Smartphone overuse is the most documented, least solved problem in consumer technology. We have tried most solutions out there, but they either ask you to rely on willpower or take away too much. We think that's the wrong approach.</p>
                <p>We're two founders building in London. We're looking for the right people to build this with.</p>
              </div>
              <div className="about-media" data-a="1">
                <div className="founders">
                  <div className="founder">
                    <div className="founder-circle">
                      <img src="/joao.png" alt="João" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <span className="founder-name">João</span>
                  </div>
                  <div className="founder">
                    <div className="founder-circle">
                      <img src="/ali.png" alt="Ali" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <span className="founder-name">Ali</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-faq" id="faq">
            <div className="faq-inner">
              <h2 data-a="">Frequently asked questions</h2>
              <div className="faq-list">
                {faqs.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} />)}
              </div>
            </div>
          </section>

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

      {showVideo && (
        <div className="video-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-box" onClick={e => e.stopPropagation()}>
            <button className="video-close" onClick={() => setShowVideo(false)}>✕</button>
            <video src="/BetaIntroVideo.mp4" controls autoPlay style={{width:'100%',display:'block'}} />
          </div>
        </div>
      )}

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
            <div className="stripe-section">
              <p>Ready to secure your spot? A £10 deposit confirms your place in the first cohort.</p>
              <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" className="btn-stripe">
                Secure my spot →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
