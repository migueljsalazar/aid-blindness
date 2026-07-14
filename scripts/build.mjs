#!/usr/bin/env node
// Build a design variant: designs/<name>/template.html -> designs/<name>/index.html
// - Injects data/programs.json into the <script id="aid-data"> marker
// - Inlines Google Fonts <link> tags as base64 @font-face so the output file is
//   fully self-contained (no network requests at runtime)
//
// Usage: node scripts/build.mjs designs/<name> [more design dirs...]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DATA_PATH = join(ROOT, 'data', 'programs.json');
const MARKER = '/*__AID_DATA__*/';
// A modern browser UA makes fonts.googleapis.com serve woff2 with unicode-range subsets.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

// curl honors HTTPS_PROXY + the system CA store in this environment; node fetch does not.
const curl = (url, binary = false) =>
  execFileSync('curl', ['-sL', '--max-time', '60', '-A', UA, url],
    { maxBuffer: 64 * 1024 * 1024, encoding: binary ? 'buffer' : 'utf8' });

const fontCssCache = new Map();

function inlineFonts(html) {
  // Remove preconnect hints; they are useless once fonts are inlined.
  html = html.replace(/[ \t]*<link[^>]*rel=["']preconnect["'][^>]*>\s*\n?/gi, '');
  return html.replace(
    /<link[^>]*href=["'](https:\/\/fonts\.googleapis\.com\/css2?[^"']+)["'][^>]*>/gi,
    (_tag, cssUrl) => {
      const url = cssUrl.replace(/&amp;/g, '&');
      if (!fontCssCache.has(url)) {
        let css = curl(url);
        css = css.replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g, (_m, fontUrl) => {
          const buf = curl(fontUrl, true);
          const ext = fontUrl.split('.').pop();
          const mime = ext === 'woff2' ? 'font/woff2' : ext === 'woff' ? 'font/woff' : 'font/ttf';
          return `url(data:${mime};base64,${buf.toString('base64')})`;
        });
        fontCssCache.set(url, css);
      }
      return `<style>/* inlined: ${url} */\n${fontCssCache.get(url)}</style>`;
    }
  );
}

function build(designDir) {
  const dir = resolve(ROOT, designDir);
  const templatePath = join(dir, 'template.html');
  if (!existsSync(templatePath)) throw new Error(`no template.html in ${designDir}`);
  let html = readFileSync(templatePath, 'utf8');
  if (!html.includes(MARKER)) throw new Error(`${designDir}/template.html is missing the ${MARKER} marker`);

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  html = html.replace(MARKER, `window.AID_DATA = ${JSON.stringify(data)};`);
  html = inlineFonts(html);

  const outPath = join(dir, 'index.html');
  writeFileSync(outPath, html);
  const kb = Math.round(Buffer.byteLength(html) / 1024);
  console.log(`built ${designDir}/index.html (${kb} KB)`);
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('usage: node scripts/build.mjs designs/<name> [...]');
  process.exit(1);
}
for (const t of targets) build(t);
