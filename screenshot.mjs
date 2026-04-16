import puppeteer from 'puppeteer-core';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const dir   = join(process.cwd(), 'temporary screenshots');

mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.replace('screenshot-', '').replace(/(-.*)?\.png$/, ''))).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = join(dir, filename);

const chromePath = 'C:\\Users\\joaop\\.cache\\puppeteer\\chrome\\win64-147.0.7727.56\\chrome-win64\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
await new Promise(r => setTimeout(r, 1200));

// If label contains 'pricing', clip to that section
if (label.includes('pricing') || label.includes('card')) {
  const rect = await page.evaluate(() => {
    const el = document.getElementById('pricing');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top + window.scrollY - 40), width: 1440, height: r.height + 80 };
  });
  if (rect) {
    await page.screenshot({ path: outPath, clip: rect });
    await browser.close();
    console.log(`Saved: ${outPath}`);
    process.exit(0);
  }
}

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
