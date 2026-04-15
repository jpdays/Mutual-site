import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jcgelvlzwfearecpoaxg.supabase.co",
  "sb_publishable_dlyG3pjDXQwPt7XRSIsxgA_tN-PItUj"
);

const STRIPE_APPLY    = "https://buy.stripe.com/bJeaEP6cO13LfKF0EBgMw02";
const STRIPE_PREORDER = "#"; // placeholder — swap when Stripe link is ready

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
  --max:1160px;
}

body{font-family:var(--sans);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;font-size:16px;line-height:1.75;overflow-x:hidden;}

#noise{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.045;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:200px 200px;}

.wrap{max-width:1080px;margin:0 auto;padding:0 40px;}
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

/* TOP BAR */
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

/* NAV */
#nav{position:fixed;top:46px;left:0;right:0;z-index:400;padding:0 32px;transition:background .4s var(--ease-out),border-color .4s var(--ease-out),backdrop-filter .4s,top .35s var(--ease-out);border-bottom:1px solid transparent;}
#nav.init{background:transparent;}
#nav.scrolled{background:rgba(249,248,245,.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom-color:rgba(226,221,214,.5);top:0;}
.nav-inner{max-width:var(--max);margin:0 auto;height:66px;display:flex;align-items:center;justify-content:space-between;}
.nav-logo-group{display:flex;align-items:center;gap:36px;}
.nav-links{display:flex;gap:28px;}
.logo{font-family:var(--serif);font-size:22px;letter-spacing:-.02em;color:var(--void);text-decoration:none;line-height:1;}
.nav-links a{font-size:13px;font-weight:400;color:var(--muted);text-decoration:none;transition:color .2s,transform .2s var(--ease-mag);display:inline-block;}
.nav-links a:hover{color:var(--ink);transform:translateY(-1px);}

/* HERO */
.s-hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:160px 40px 100px;background:var(--bg);position:relative;}
.hero-content{max-width:640px;text-align:center;margin:0 auto;}
.hero-h{font-family:var(--sans);font-weight:700;font-size:clamp(38px,5.5vw,68px);line-height:1.08;letter-spacing:-0.03em;margin-bottom:22px;color:var(--ink);}
.hero-h em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--ink);}
.hero-sub{font-size:clamp(16px,1.6vw,18px);color:var(--muted);line-height:1.75;margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto;font-weight:400;}

.s{padding:96px 0;}

/* STORY BEATS */
.story-beat{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;padding:0 40px;max-width:1080px;margin:0 auto;}
.story-beat.flip{direction:rtl;}
.story-beat.flip > *{direction:ltr;}
.story-text .label{margin-bottom:20px;}
.story-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:18px;color:var(--ink);max-width:380px;}
.story-text p{font-size:15px;color:var(--muted);line-height:1.9;max-width:380px;}
.story-text p+p{margin-top:14px;}
.story-stat{margin-top:24px;display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--muted);border-top:1px solid var(--border);padding-top:18px;}
.story-stat strong{color:var(--ink);font-size:15px;font-weight:600;}
.story-illus{width:100%;aspect-ratio:4/3;background:var(--surface);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:12px;text-align:center;padding:28px;border:1px solid var(--border);position:relative;overflow:hidden;}

/* HOW THE PHONE WORKS */
.s-htpw{padding:96px 0;}
.htpw-inner{max-width:1080px;margin:0 auto;padding:0 40px;}
.htpw-hdr{margin-bottom:56px;}
.htpw-hdr h2{font-size:clamp(28px,3.5vw,44px);letter-spacing:-0.025em;}
.htpw-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.htpw-left-label{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:24px;display:block;}
.htpw-examples{display:flex;flex-direction:column;gap:4px;}
.htpw-ex{display:flex;align-items:center;gap:16px;padding:18px 22px;border-radius:16px;cursor:pointer;border:1.5px solid transparent;transition:background .18s var(--ease-mag),border-color .18s,box-shadow .18s;user-select:none;}
.htpw-ex:hover{background:var(--surface);}
.htpw-ex.active{background:var(--white);border-color:var(--border);box-shadow:0 2px 16px rgba(0,0,0,.06);}
.htpw-ex-dot{width:8px;height:8px;border-radius:50%;background:var(--border);flex-shrink:0;transition:background .18s,transform .18s;}
.htpw-ex.active .htpw-ex-dot{background:var(--signal);transform:scale(1.15);}
.htpw-ex-text{font-size:16px;font-weight:500;color:var(--muted);line-height:1.3;transition:color .18s;}
.htpw-ex.active .htpw-ex-text{color:var(--ink);}
.htpw-right{display:flex;justify-content:center;}
.htpw-phone-frame{width:260px;background:var(--void);border-radius:40px;aspect-ratio:9/19.5;position:relative;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.08);}
.htpw-phone-frame::before{content:'';position:absolute;top:12px;left:50%;transform:translateX(-50%);width:40px;height:5px;background:rgba(255,255,255,.07);border-radius:3px;z-index:3;}
.htpw-phone-screen{position:absolute;inset:4px;border-radius:37px;background:#111;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.htpw-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.htpw-ph{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:rgba(255,255,255,.22);height:100%;width:100%;}
.htpw-ph-icon{font-size:28px;opacity:.5;}
.htpw-ph-text{font-family:var(--sans);font-size:10px;letter-spacing:.12em;text-transform:uppercase;}

/* HOW TO JOIN */
.s-process{padding:96px 0;}
.process-inner{max-width:1240px;margin:0 auto;padding:0 32px;}
.process-hdr{margin-bottom:52px;}
.process-hdr h2{font-size:clamp(32px,3.8vw,52px);letter-spacing:-0.04em;line-height:1.04;margin-bottom:8px;max-width:12ch;}
.process-track{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}
.process-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:34px 28px 30px;display:flex;flex-direction:column;min-height:270px;transition:border-color .2s,box-shadow .2s,transform .2s var(--ease-mag);}
.process-card:hover{border-color:rgba(232,160,48,.45);box-shadow:0 14px 30px rgba(0,0,0,.06),0 4px 10px rgba(0,0,0,.03);transform:translateY(-1px);}
.process-card-head{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.process-num{font-family:var(--serif);font-style:italic;font-size:30px;color:#B8B1A9;line-height:1;flex-shrink:0;}
.process-card-title{font-size:18px;font-weight:600;color:var(--ink);letter-spacing:-0.02em;line-height:1.25;}
.process-card-desc{font-size:15px;color:var(--muted);line-height:1.8;flex:1;}
.process-card-cta{margin-top:24px;}

/* PRICING */
.s-pricing{padding:112px 0;background:#FFFFFF;border-top:1px solid rgba(34,31,28,.08);}
.pricing-shell{max-width:1160px;margin:0 auto;padding:0 40px;}
.pricing-panel{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:56px;align-items:center;}
.pricing-media{display:flex;justify-content:center;align-items:center;min-width:0;}
.pricing-device{width:min(100%,640px);}
.pricing-device img{width:100%;height:auto;display:block;filter:drop-shadow(0 30px 40px rgba(17,16,14,.16));}
.pricing-content{min-width:0;}
.pricing-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding-bottom:22px;margin-bottom:24px;border-bottom:1px solid rgba(34,31,28,.08);}
.pricing-title{font-size:clamp(24px,2.8vw,30px);font-weight:500;letter-spacing:-0.03em;line-height:1.08;color:#181613;max-width:12ch;}
.pricing-cohort{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end;}
.pricing-cohort-label{font-size:15px;font-weight:500;letter-spacing:-.02em;color:#181613;}
.pricing-badge{display:inline-flex;align-items:center;justify-content:center;padding:7px 12px;border-radius:999px;background:#E5484D;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;}
.pricing-options{display:flex;flex-direction:column;gap:12px;}
.pricing-option{width:100%;text-align:left;background:#FFFFFF;border:1px solid #D7D7DB;border-radius:20px;padding:18px 20px;transition:border-color .24s var(--ease-out),box-shadow .24s var(--ease-out),transform .24s var(--ease-mag);}
.pricing-option:hover{transform:translateY(-1px);border-color:#BDBDC4;box-shadow:0 10px 20px rgba(17,16,14,.05);}
.pricing-option:focus-visible{outline:none;border-color:#F59E0B;box-shadow:0 0 0 4px rgba(245,158,11,.12);}
.pricing-option:active{transform:scale(.995);}
.pricing-option.selected{border:2px solid #F59E0B;box-shadow:none;padding:17px 19px;}
.pricing-option-head{display:flex;gap:16px;align-items:flex-start;}
.pricing-radio{width:22px;height:22px;border-radius:50%;border:1.5px solid #C9C9CF;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:border-color .2s var(--ease-out),background-color .2s var(--ease-out),transform .2s var(--ease-mag),box-shadow .2s var(--ease-out);}
.pricing-radio::after{content:'';width:10px;height:10px;border-radius:50%;background:#181613;opacity:0;transform:scale(.45);transition:opacity .2s var(--ease-out),transform .22s var(--ease-mag);}
.pricing-option.selected .pricing-radio{border-color:#F59E0B;background:#FFFFFF;box-shadow:none;}
.pricing-option.selected .pricing-radio::after{opacity:1;transform:scale(1);}
.pricing-option-copy{flex:1;min-width:0;}
.pricing-option-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
.pricing-option-title{font-size:19px;font-weight:500;line-height:1.28;letter-spacing:-0.03em;color:#181613;max-width:34ch;}
.pricing-option-price{font-size:19px;font-weight:500;letter-spacing:-0.03em;color:#181613;white-space:nowrap;}
.pricing-option-details{max-height:0;opacity:0;overflow:hidden;transition:max-height .34s var(--ease-out),opacity .26s var(--ease-out),padding-top .24s var(--ease-out);}
.pricing-option.selected .pricing-option-details{max-height:140px;opacity:1;padding-top:14px;}
.pricing-option-detail{font-size:14px;line-height:1.72;color:#5A534B;max-width:44ch;}
.pricing-option-detail + .pricing-option-detail{margin-top:2px;}
.pricing-cta{margin-top:24px;display:flex;align-items:center;gap:14px;}
.pricing-qty{display:inline-flex;align-items:center;border:1px solid #D7D7DB;border-radius:999px;overflow:hidden;background:#FFFFFF;flex-shrink:0;}
.pricing-qty-btn{width:42px;height:48px;border:none;background:transparent;color:#181613;font-family:var(--sans);font-size:22px;font-weight:400;display:flex;align-items:center;justify-content:center;transition:opacity .2s var(--ease-out),transform .2s var(--ease-mag),background-color .2s var(--ease-out);}
.pricing-qty-btn:hover{background:#F6F6F7;}
.pricing-qty-btn:focus-visible{outline:none;background:#F6F6F7;}
.pricing-qty-btn:active{transform:scale(.94);}
.pricing-qty-btn:disabled{opacity:.35;cursor:default;}
.pricing-qty-value{min-width:34px;padding:0 4px;text-align:center;font-size:16px;font-weight:500;color:#181613;}
.pricing-action{display:inline-flex;align-items:center;justify-content:center;border:none;border-radius:999px;background:#11100E;color:#FFFFFF;padding:15px 32px;font-family:var(--sans);font-size:15px;font-weight:600;letter-spacing:-.01em;text-decoration:none;transition:transform .24s var(--ease-mag),opacity .24s var(--ease-out),box-shadow .24s var(--ease-out);box-shadow:0 18px 30px rgba(17,16,14,.12),0 6px 12px rgba(17,16,14,.08);min-width:220px;flex:1;}
.pricing-action:hover{transform:scale(1.03);opacity:.96;}
.pricing-action:focus-visible{outline:none;box-shadow:0 0 0 4px rgba(17,16,14,.1),0 18px 30px rgba(17,16,14,.12),0 6px 12px rgba(17,16,14,.08);}
.pricing-action:active{transform:scale(.98);}
.pricing-foot{margin-top:22px;padding-top:18px;border-top:1px solid rgba(34,31,28,.08);}
.pricing-batch{font-size:14px;font-weight:500;line-height:1.7;color:#403A34;margin-bottom:14px;}
.pricing-meta{display:flex;flex-direction:column;gap:4px;}
.pricing-meta-item{font-size:13px;line-height:1.7;color:#6B645D;}

/* ABOUT */
.s-about{padding:96px 0;}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;max-width:1080px;margin:0 auto;padding:0 40px;}
.about-text h2{font-size:clamp(24px,2.8vw,36px);margin-bottom:24px;max-width:380px;}
.about-text p{font-size:15px;line-height:1.9;color:var(--muted);margin-bottom:18px;max-width:380px;}
.about-text p:last-child{margin-bottom:0;}
.about-media{display:flex;flex-direction:column;gap:16px;}
.founders{display:flex;gap:48px;justify-content:flex-start;margin-top:32px;}
.founder{display:flex;flex-direction:column;align-items:center;gap:10px;}
.founder-circle{width:100px;height:100px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);overflow:hidden;}
.founder-circle img{width:100%;height:100%;object-fit:cover;}
.founder-name{font-size:13px;font-weight:500;color:var(--ink);letter-spacing:-.01em;}

/* FAQ */
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
.sub-nav-inner{max-width:1080px;margin:0 auto;height:62px;display:flex;align-items:center;justify-content:space-between;}

/* APPLY PAGE */
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
  .htpw-layout{grid-template-columns:1fr;gap:40px;}
  .htpw-right{display:none;}
  .process-track{grid-template-columns:1fr 1fr;}
  .process-card{min-height:240px;}
  .pricing-panel{grid-template-columns:1fr;gap:32px;}
  .pricing-device{max-width:560px;margin:0 auto;}
}
@media(max-width:640px){
  #topBar{padding:8px 20px;}
  .tb-label{display:none;}
  .tb{justify-content:center;}
  #nav{padding:0 20px;}
  .nav-links{display:none;}
  .s-hero{padding:140px 24px 80px;}
  .wrap{padding:0 24px;}
  .story-beat,.faq-inner,.htpw-inner,.process-inner,.about-grid{padding:0 24px;}
  .site-footer{padding:64px 24px 40px;}
  .tally-card{padding:24px 20px;}
  .apply-nav,.apply-body,.sub-nav{padding-left:24px;padding-right:24px;}
  .s,.s-htpw,.s-process,.s-pricing,.s-faq,.s-about{padding:72px 0;}
  .process-track{grid-template-columns:1fr;}
  .process-card{padding:28px 22px 24px;min-height:0;}
  .process-card-head{align-items:flex-start;gap:12px;margin-bottom:14px;}
  .process-num{font-size:28px;}
  .process-card-title{font-size:17px;}
  .process-card-desc{font-size:14px;line-height:1.75;}
  .pricing-shell{padding:0 24px;}
  .pricing-top{gap:14px;padding-bottom:18px;margin-bottom:20px;}
  .pricing-title{font-size:26px;}
  .pricing-cohort{justify-content:flex-start;}
  .pricing-option{padding:16px;border-radius:18px;}
  .pricing-option.selected{padding:15px;}
  .pricing-option-row{gap:12px;}
  .pricing-option-title,.pricing-option-price{font-size:17px;}
  .pricing-cta{flex-wrap:wrap;}
  .pricing-qty{height:46px;}
  .pricing-qty-btn{height:46px;}
  .pricing-action{min-width:0;width:100%;}
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

function SiteFooter({ ok, emailRef, onSubmit }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-wl" data-a="">
          <p>Leave your email and we'll keep you updated.</p>
          {!ok ? (
            <form className="footer-form" onSubmit={onSubmit}>
              <input type="email" placeholder="Email address" required ref={emailRef} />
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

const HTPW_EXAMPLES = [
  { id: 0, label: 'No Instagram after 9pm',              video: '/how-1.mp4' },
  { id: 1, label: 'Only the essential apps during work',  video: '/how-2.mp4' },
  { id: 2, label: 'No social media at work',              video: '/how-3.mp4' },
];

function HowThePhoneWorks() {
  const [active,  setActive]  = useState(0);
  const [errored, setErrored] = useState({});
  const ex = HTPW_EXAMPLES[active];

  return (
    <section className="s-htpw" id="how-it-works">
      <div className="htpw-inner">
        <div className="htpw-hdr" data-a="">
          <h2>How the Phone Works</h2>
        </div>
        <div className="htpw-layout">
          <div data-a="1">
            <span className="htpw-left-label">You tell us what you want</span>
            <div className="htpw-examples">
              {HTPW_EXAMPLES.map(e => (
                <div
                  key={e.id}
                  className={`htpw-ex${active === e.id ? ' active' : ''}`}
                  onClick={() => setActive(e.id)}
                >
                  <span className="htpw-ex-dot" />
                  <span className="htpw-ex-text">{e.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="htpw-right" data-a="2">
            <div className="htpw-phone-frame">
              <div className="htpw-phone-screen">
                <div className="htpw-ph">
                  <span className="htpw-ph-icon">▶</span>
                  <span className="htpw-ph-text">Video coming soon</span>
                </div>
                {!errored[ex.id] && (
                  <video
                    key={ex.id}
                    src={ex.video}
                    autoPlay muted loop playsInline
                    className="htpw-video"
                    onError={() => setErrored(p => ({...p, [ex.id]: true}))}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowToJoin({ goApply }) {
  const CARDS = [
    { n:'1', title:'Apply to Early Access',              desc:'Fill out a short application. We read every one ourselves.',                                                                 cta: true  },
    { n:'2', title:'Have a Quick Conversation',          desc:'If it looks like a fit, we’ll reach out for a short call to make sure Mutual is right for you.'                                },
    { n:'3', title:'Get Your Phone, Set Up Your Way',    desc:'A pre-configured Samsung device arrives ready to match your rules.'                                                             },
    { n:'4', title:'Check In and Refine',                desc:'We review what’s working and adjust the setup until it sticks.'                                                                  },
  ];

  return (
    <section className="s-process" id="join">
      <div className="process-inner">
        <div className="process-hdr" data-a="">
          <h2>Stop scrolling for 50p a day</h2>
        </div>
        <div className="process-track" data-a="1">
          {CARDS.map((card, i) => (
            <div key={i} className="process-card">
              <div className="process-card-head">
                <div className="process-num">{card.n}</div>
                <div className="process-card-title">{card.title}</div>
              </div>
              <div className="process-card-desc">{card.desc}</div>
              {card.cta && (
                <div className="process-card-cta">
                  <button className="btn btn-void btn-sm" onClick={goApply}>Request Early Access →</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ goApply }) {
  const [selectedOption, setSelectedOption] = useState('preorder');
  const [quantity, setQuantity] = useState(1);
  const isPreorder = selectedOption === 'preorder';

  return (
    <section className="s-pricing" id="pricing">
      <div className="pricing-shell">
        <div className="pricing-panel" data-a="1">
          <div className="pricing-media">
            <div className="pricing-device">
              <img src="/samsunggalaxya17.png" alt="Samsung Galaxy A17 5G" />
            </div>
          </div>

          <div className="pricing-content">
            <div className="pricing-top">
              <h2 className="pricing-title">Pre-order your phone</h2>
              <div className="pricing-cohort">
                <span className="pricing-cohort-label">First cohort</span>
                <span className="pricing-badge">Sold out</span>
              </div>
            </div>

            <div className="pricing-options" role="radiogroup" aria-label="Pre-order options">
              <button
                type="button"
                className={`pricing-option${isPreorder ? ' selected' : ''}`}
                onClick={() => setSelectedOption('preorder')}
                role="radio"
                aria-checked={isPreorder}
              >
                <div className="pricing-option-head">
                  <span className="pricing-radio" aria-hidden="true" />
                  <div className="pricing-option-copy">
                    <div className="pricing-option-row">
                      <div className="pricing-option-price">&pound;15 per month</div>
                    </div>
                    <div className="pricing-option-details" aria-hidden={!isPreorder}>
                      <p className="pricing-option-detail">&pound;170 paid upfront.</p>
                      <p className="pricing-option-detail">Cancel anytime. Get refunded for unused time.</p>
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                className={`pricing-option${!isPreorder ? ' selected' : ''}`}
                onClick={() => setSelectedOption('reserve')}
                role="radio"
                aria-checked={!isPreorder}
              >
                <div className="pricing-option-head">
                  <span className="pricing-radio" aria-hidden="true" />
                  <div className="pricing-option-copy">
                    <div className="pricing-option-row">
                      <div className="pricing-option-title">Undecided? Reserve a spot in the next cohort for &pound;15</div>
                    </div>
                    <div className="pricing-option-details" aria-hidden={isPreorder}>
                      <p className="pricing-option-detail">Discounted from your first month if you continue. Refunded otherwise.</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="pricing-cta">
              <div className="pricing-qty" aria-label="Quantity selector">
                <button
                  type="button"
                  className="pricing-qty-btn"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="pricing-qty-value" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  className="pricing-qty-btn"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
              {isPreorder ? (
                <a href={STRIPE_PREORDER} className="pricing-action">Pre-order now</a>
              ) : (
                <button type="button" className="pricing-action" onClick={goApply}>Pre-order now</button>
              )}
            </div>

            <div className="pricing-foot">
              <p className="pricing-batch">Secure a place in the next batch in late May (UK only)</p>
              <div className="pricing-meta">
                <p className="pricing-meta-item">Hardware: Samsung Galaxy A17 5G</p>
                <p className="pricing-meta-item">Cancel anytime. Get refunded for unused time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [page,      setPage]      = useState('main');
  const [tbOk,      setTbOk]      = useState(false);
  const [footerOk,  setFooterOk]  = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const tbEmailRef     = useRef();
  const footerEmailRef = useRef();
  const heroRef        = useRef();
  const navRef         = useRef();
  const topBarRef      = useRef();

  const goPage  = (p) => { setPage(p); window.scrollTo({top:0,behavior:'instant'}); };
  const goApply = ()  => goPage('apply');
  const goMain  = ()  => goPage('main');

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

  const faqs = [
    { q: 'What phone will I receive?',                        a: 'A Samsung Galaxy A17, pre-configured by us before it arrives. No setup required on your end.' },
    { q: 'What happens to my current phone?',                 a: "You keep it. Most users keep their current device as a backup, especially for the first week. You're not giving anything up." },
    { q: 'Can I still use WhatsApp, maps, and banking apps?', a: "Yes. Mutual removes what pulls you away — not what you actually need. You tell us what stays, and it stays." },
    { q: 'Can I still download and delete apps?',             a: "Yes, with one exception. You can download and delete anything freely, except the apps you specifically asked us to manage." },
    { q: 'What if I want to change something?',               a: "You message us. We make the adjustment. The friction is intentional, it keeps you accountable, but we're here to make it work for you, not to be dogmatic about it." },
    { q: 'How long does this last?',                          a: "A few weeks. Enough time to actually feel a difference. After that, you decide whether to continue, adjust, or stop." },
    { q: 'Why is there a £10 deposit?',                       a: "To make sure the people who apply actually mean it. If you're not selected for this cohort, you'll receive a full refund or we'll roll it to the next opening — your choice." },
    { q: "What if it's not working for me?",                  a: "That's exactly the feedback we need. We'll work with you to understand what's not working and adjust. This cohort is as much about us learning as it is about you changing." },
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
    <SiteFooter ok={footerOk} emailRef={footerEmailRef} onSubmit={handleFooterSubmit} />
  );

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

      {/* MAIN PAGE */}
      {page === 'main' && (
        <div id="page-main">
          <nav id="nav" className="init" ref={navRef}>
            <div className="nav-inner">
              <div className="nav-logo-group">
                <a className="logo" href="#" onClick={(e) => { e.preventDefault(); goMain(); }}>mutual.</a>
                <div className="nav-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); goPage('why'); }}>Why Mutual</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); goPage('faq'); }}>FAQ</a>
                </div>
              </div>
              <button className="btn btn-void btn-sm" onClick={goApply}>Request Early Access</button>
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

          <HowThePhoneWorks />
          <HowToJoin goApply={goApply} />
          <Pricing goApply={goApply} />
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
              <a href={STRIPE_APPLY} target="_blank" rel="noopener noreferrer" className="btn-stripe">
                Secure my spot →
              </a>
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
                <div className="founders">
                  <div className="founder">
                    <div className="founder-circle">
                      <img src="/joao.png" alt="João" onError={(e) => { e.target.style.display='none'; }} />
                    </div>
                    <span className="founder-name">João</span>
                  </div>
                  <div className="founder">
                    <div className="founder-circle">
                      <img src="/ali.png" alt="Ali" onError={(e) => { e.target.style.display='none'; }} />
                    </div>
                    <span className="founder-name">Ali</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s">
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
