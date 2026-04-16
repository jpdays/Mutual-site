import puppeteer from 'puppeteer-core';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url    = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] || 'crop';
const dir    = join(process.cwd(), 'temporary screenshots');
mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.replace('screenshot-','').replace(/(-.*)?\.png$/,''))).filter(n=>!isNaN(n));
const next = nums.length ? Math.max(...nums)+1 : 1;
const filename = `screenshot-${next}-${label}.png`;
const outPath = join(dir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:\Users\joaop\.cache\puppeteer\chrome\win64-147.0.7727.56\chrome-win64\chrome.exe',
  headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
await new Promise(r => setTimeout(r, 1000));

const rect = await page.evaluate(() => {
  const el = document.getElementById('pricing');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const scrollY = window.scrollY;
  return { x: 0, y: r.top + scrollY, width: 1440, height: r.height };
});

if (rect) {
  await page.screenshot({ path: outPath, clip: rect });
} else {
  await page.screenshot({ path: outPath, fullPage: true });
}
await browser.close();
console.log(`Saved: ${outPath}`);
