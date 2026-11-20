// Prerender every public route to static HTML after `vite build` + the SSR build.
//   dist/<route>/index.html  – real markup + per-route <head>, hydrated on load
//   dist/404.html            – served by Cloudflare Pages for unknown URLs (with a 404 status)
// No browser needed: uses react-dom/server through dist-ssr/entry-server.js.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const { render, ROUTES, SITE_URL } = await import(
  pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href
);
const template = await readFile(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function setHead(html, { title, description, url, index }) {
  const rep = (re, to) => {
    if (!re.test(html)) throw new Error(`prerender: template is missing ${re}`);
    html = html.replace(re, to);
  };
  rep(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  rep(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`);
  rep(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  rep(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`);
  rep(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`);
  rep(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`);
  rep(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`);
  rep(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`);
  if (!index) html = html.replace("</head>", `    <meta name="robots" content="noindex, nofollow" />\n  </head>`);
  return html;
}

function inject(html, body) {
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const warn = console.warn;
console.warn = () => {}; // React dev-only prop warnings are not actionable here
console.error = ((orig) => (...a) => (a.map(String).join(" ").includes("fetchPriority") ? undefined : orig(...a)))(console.error);

for (const r of ROUTES) {
  const body = await render(r.path);
  const url = `${SITE_URL}${r.path === "/" ? "/" : r.path}`;
  const html = inject(setHead(template, { ...r, url }), body);
  const out = r.path === "/" ? join(dist, "index.html") : join(dist, r.path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  console.log(`prerendered ${r.path.padEnd(30)} ${(html.length / 1024).toFixed(0)} kB  ${r.index ? "index" : "noindex"}`);
}

// 404 page: render a path no route matches so the catch-all renders.
const nf = await render("/__not-found__");
await writeFile(
  join(dist, "404.html"),
  inject(
    setHead(template, {
      title: "Page not found | Altaventures",
      description: "The page you're looking for doesn't exist or has moved.",
      url: `${SITE_URL}/`,
      index: false,
    }),
    nf,
  ),
);
console.log("prerendered 404.html");
console.warn = warn;
