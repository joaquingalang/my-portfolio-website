#!/usr/bin/env node
/**
 * Checks for the calling card. Run with `npm run card:test`.
 *
 * The repo has no test runner, and adding one for this would be heavier than
 * the thing being tested — so this is a plain script. It covers the parts that
 * fail silently and expensively: vCard formatting (a malformed file makes iOS
 * show plain text instead of the Add Contact sheet), the bot filter (without it
 * the first number is wrong and there is no way to tell), and the guarantee
 * that a dead analytics store cannot take the page down.
 *
 * What it cannot cover: how a real iPhone and a real Android handle the .vcf.
 * That has to be done by hand on a preview deployment.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outdir = resolve(root, 'node_modules/.tmp/card-test');

await mkdir(outdir, { recursive: true });
const stub = resolve(outdir, 'functions-stub.mjs');
await writeFile(stub, 'export function waitUntil(p) { return p; }\n');

await esbuild.build({
  entryPoints: ['api/card.ts', 'api/vcard.ts', 'api/_lib/analytics.ts'].map((f) =>
    resolve(root, f),
  ),
  bundle: true, format: 'esm', platform: 'node', outdir,
  entryNames: '[name]', outExtension: { '.js': '.mjs' },
  alias: { '@vercel/functions': stub }, logLevel: 'warning',
});

const load = (name) => import(pathToFileURL(resolve(outdir, `${name}.mjs`)));
// The functions export the `fetch` Web Standard shape the Node runtime expects.
const card = (await load('card')).default.fetch;
const vcard = (await load('vcard')).default.fetch;
const { isNoise, recordEvent } = await load('analytics');

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const req = (url, init = {}) =>
  new Request(url, { headers: { 'user-agent': IPHONE }, ...init });

let failures = 0;
const ok = (label, condition, extra = '') => {
  if (!condition) failures++;
  console.log(`${condition ? '  ok  ' : '  FAIL'} ${label}${extra ? ` — ${extra}` : ''}`);
};

console.log('\n/c page');
const rc = card(req('https://joaquingalang.dev/api/card?s=c'));
const hc = await rc.text();
ok('200', rc.status === 200);
ok('serves html', rc.headers.get('content-type') === 'text/html; charset=utf-8');
ok('uncached, so every scan is counted', rc.headers.get('cache-control') === 'no-store');
ok('save contact is present', hc.includes('>Save contact<'));
ok('save contact is a plain anchor (works with JS off)',
  /<a class="cta"[^>]*href="\/c\/contact\.vcf"[^>]*download=/.test(hc));
ok('vcf points at /c', hc.includes('href="/c/contact.vcf"'));
ok('email', hc.includes('mailto:galang.joaquin.dev@gmail.com'));
ok('whatsapp uses E.164 digits', hc.includes('https://wa.me/639156175207'));
ok('all five links render', ['Portfolio', 'GitHub', 'LinkedIn', 'TrustMop', 'Marahuyo Studios']
  .every((l) => hc.includes(`<span>${l}</span>`)));
ok('surface tagged for analytics', hc.includes("surface: 'c'"));
ok('no unresolved values', !hc.includes('undefined') && !hc.includes('[object'));
ok('no placeholder content', !/lorem|TODO|PLACEHOLDER|FIXME/i.test(hc));
console.log(`       page is ${Buffer.byteLength(hc)} bytes`);

console.log('\n/e page');
const he = await card(req('https://joaquingalang.dev/api/card?s=e')).text();
ok('vcf points at /e', he.includes('href="/e/contact.vcf"'));
ok('distinguishable in layer 2', he.includes("surface: 'e'"));

console.log('\nmethods');
const rh = card(req('https://joaquingalang.dev/api/card?s=c', { method: 'HEAD' }));
ok('HEAD returns headers only', rh.status === 200 && rh.body === null);
ok('POST is rejected', card(req('https://joaquingalang.dev/api/card?s=c', { method: 'POST' })).status === 405);

console.log('\nvCard');
const rv = vcard(req('https://joaquingalang.dev/api/vcard?s=c'));
const v = await rv.text();
ok('content-type', rv.headers.get('content-type') === 'text/vcard; charset=utf-8');
ok('content-disposition',
  rv.headers.get('content-disposition') === 'attachment; filename="joaquin-galang.vcf"');
ok('vCard 3.0', v.includes('VERSION:3.0'));
ok('well formed', v.startsWith('BEGIN:VCARD') && v.trimEnd().endsWith('END:VCARD'));
ok('FN', v.includes('FN:Joaquin Galang'));
ok('N', v.includes('N:Galang;Joaquin;;;'));
ok('TITLE', v.includes('TITLE:Software Developer'));
ok('ORG omitted', !/\r\nORG[:;]/.test(v));
ok('TEL', v.includes('TEL;TYPE=CELL,VOICE:+639156175207'));
ok('EMAIL', v.includes('EMAIL;TYPE=INTERNET,PREF:galang.joaquin.dev@gmail.com'));
ok('URL', v.includes('URL:https://joaquingalang.dev'));
ok('PHOTO', v.includes('PHOTO;ENCODING=b;TYPE=JPEG:'));
ok('CRLF throughout', v.includes('\r\n') && !/[^\r]\n/.test(v));
const longest = Math.max(...v.split('\r\n').map((l) => l.length));
ok('lines folded to 75 octets', longest <= 75, `longest = ${longest}`);
ok('folded continuations are space-prefixed', v.split('\r\n').some((l) => l.startsWith(' ')));
ok('stays small for iOS', Buffer.byteLength(v) < 20_000, `${Buffer.byteLength(v)} bytes`);

console.log('\nbot and prefetch filter');
const noise = (headers, init) => isNoise(new Request('https://joaquingalang.dev/c', { headers, ...init }));
ok('a real phone is counted', !noise({ 'user-agent': IPHONE }));
for (const [label, ua] of [
  ['facebook/messenger', 'facebookexternalhit/1.1'],
  ['whatsapp', 'WhatsApp/2.23'],
  ['slack', 'Slackbot-LinkExpanding 1.0'],
  ['x/twitter', 'Twitterbot/1.0'],
  ['discord', 'Mozilla/5.0 (compatible; Discordbot/2.0)'],
  ['google', 'Googlebot/2.1'],
  ['curl', 'curl/8.4.0'],
]) ok(`${label} preview dropped`, noise({ 'user-agent': ua }));
ok('empty user-agent dropped', noise({}));
ok('HEAD dropped', noise({ 'user-agent': IPHONE }, { method: 'HEAD' }));
ok('prefetch dropped', noise({ 'user-agent': IPHONE, 'sec-purpose': 'prefetch;prerender' }));

console.log('\nfailure isolation');
process.env.UPSTASH_REDIS_REST_URL = 'https://not-a-real-host.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN = 'deliberately-bad-token';
const rBad = card(req('https://joaquingalang.dev/api/card?s=c'));
const hBad = await rBad.text();
ok('page still renders with a dead store', rBad.status === 200 && hBad.includes('>Save contact<'));
let threw = false;
try {
  await recordEvent(req('https://joaquingalang.dev/c'), 'c', 'visit');
} catch {
  threw = true;
}
ok('a failed write never rejects', !threw);

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}\n`);
process.exit(failures ? 1 : 0);
