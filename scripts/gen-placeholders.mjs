// One-off script to render placeholder raster assets from SVG sources.
// Not part of the app build. `sharp` is not a project dependency:
// run `npm i -D sharp` before re-running this script, then `npm uninstall sharp`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/og", { recursive: true });
mkdirSync("public/images/projects", { recursive: true });
mkdirSync("public/images/brand", { recursive: true });
mkdirSync("public/images/hero", { recursive: true });

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06122E" />
      <stop offset="100%" stop-color="#02256F" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1040" cy="90" r="260" fill="#0D68EF" opacity="0.18" />
  <text x="90" y="300" font-family="Arial, sans-serif" font-size="72" font-weight="800" fill="#FFFFFF">
    Alta<tspan fill="#5fa2ff">ventures</tspan>
  </text>
  <text x="90" y="360" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="#B9C6E6">
    We build the engine. You drive the business.
  </text>
  <text x="90" y="420" font-family="Arial, sans-serif" font-size="22" fill="#7C8FBE">
    Websites · Booking Systems · Business Digitalization
  </text>
</svg>`;

function projectCard(label, category) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="#F6F8FC" />
  <rect x="24" y="24" width="1152" height="702" rx="24" fill="none" stroke="#0A0F1C" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="10 10" />
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#02256F" text-anchor="middle">${label}</text>
  <text x="600" y="410" font-family="Arial, sans-serif" font-size="22" fill="#0A0F1C" opacity="0.5" text-anchor="middle">${category}</text>
  <text x="600" y="460" font-family="Arial, sans-serif" font-size="16" fill="#0A0F1C" opacity="0.35" text-anchor="middle">TODO(asset): replace with real screenshot</text>
</svg>`;
}

const heroBgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="hero-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06122E" />
      <stop offset="55%" stop-color="#0A1A3D" />
      <stop offset="100%" stop-color="#02256F" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#hero-bg)" />
  <circle cx="1600" cy="180" r="420" fill="#0D68EF" opacity="0.16" />
  <circle cx="260" cy="920" r="360" fill="#0D68EF" opacity="0.10" />
  <text x="960" y="550" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="#FFFFFF" fill-opacity="0.35" text-anchor="middle">
    TODO(asset): full-bleed hero background pending
  </text>
</svg>`;

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120" viewBox="0 0 480 120">
  <rect width="480" height="120" fill="#FFFFFF" />
  <text x="24" y="76" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="#02256F">Alta<tspan fill="#0D68EF">ventures</tspan></text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile("public/og/altaventures-og.png");

await sharp(Buffer.from(logoSvg)).png().toFile("public/images/brand/altaventures-logo.png");

await sharp(Buffer.from(heroBgSvg)).jpeg({ quality: 82 }).toFile("public/images/hero/hero-bg.jpg");

const projects = [
  ["setmona", "SETMONA", "Booking &amp; Scheduling"],
  ["altamotors", "ALTAMOTORS", "Motorcycle Financing &amp; Sales"],
  ["kolekta", "KOLEKTA", "Loan Management &amp; Billing"],
  ["vocalyze", "VOCALYZE", "Entertainment Website &amp; Digitalization"],
];

for (const [id, label, category] of projects) {
  await sharp(Buffer.from(projectCard(label, category)))
    .png()
    .toFile(`public/images/projects/${id}.png`);
}

console.log("Placeholder assets generated.");
