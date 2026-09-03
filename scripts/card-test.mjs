#!/usr/bin/env node
/**
 * Checks for the calling card. Run with `npm run card:test`.
 *
 * The repo has no test runner, and adding one for this would be heavier than
 * the thing being tested — so this is a plain script. It covers the parts that
 * fail silently and expensively: vCard formatting (a malformed file makes iOS
 * show plain text instead of the Add Contact sheet), the bot filter (without it
 * the first number is wrong and there is no way to tell), the gate actually
 * gating and actually letting people past, and the guarantee that a dead
 * analytics store cannot take the page down.
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

/** A gate submission, as a browser would send it with JavaScript switched off. */
const post = (surface, fields) => {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) value.forEach((v) => body.append(key, v));
    else body.append(key, value);
  }
  return card(
    new Request(`https://joaquingalang.dev/api/card?s=${surface}`, {
      method: 'POST',
      headers: {
        'user-agent': IPHONE,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    }),
  );
};

/** Old enough to clear the "no human types this fast" trap. */
const UNHURRIED = () => String(Date.now() - 5000);

/**
 * The prose only, for the filler check below. The stylesheet legitimately
 * contains `::placeholder` and the gate's inputs legitimately carry
 * `placeholder=` attributes; neither is leftover filler, and both used to trip
 * the check the moment the form was added.
 */
const copyOf = (html) =>
  html.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/placeholder=/g, 'ph=');

let failures = 0;
const ok = (label, condition, extra = '') => {
  if (!condition) failures++;
  console.log(`${condition ? '  ok  ' : '  FAIL'} ${label}${extra ? ` — ${extra}` : ''}`);
};

console.log('\n/c gate — what a scan lands on');
const rg = await card(req('https://joaquingalang.dev/api/card?s=c'));
const hg = await rg.text();
ok('200', rg.status === 200);
ok('serves html', rg.headers.get('content-type') === 'text/html; charset=utf-8');
ok('uncached, so every scan is counted', rg.headers.get('cache-control') === 'no-store');
ok('is a real form post (works with JS off)',
  /<form class="gate" method="post" action="\/c">/.test(hg));
ok('name is required', /id="name"[^>]*required/.test(hg));
ok('all seven "met" options render', [
  'A conference or meetup', 'A hackathon', 'A job fair', 'A client meeting',
  'We just ran into each other', 'Someone passed it on', 'Found it online',
].every((o) => hg.includes(`<option value="${o}">`)));
ok('DEVCON, GDG and campus options are gone',
  !/DEVCON|GDG|Around campus/i.test(hg));
ok('all five intent options render', [
  'Hiring', 'A project I need built', 'Collaborating', 'Advice or mentorship', 'Just connecting',
].every((o) => hg.includes(`value="${o}"`)));
ok('reach-me field', hg.includes('id="reach"'));
ok('remember field, capped at 140', /id="note"[^>]*maxlength="140"/.test(hg));
ok('skip link is a plain anchor', hg.includes('<a class="skip" href="/c?v=1">'));
ok('honeypot is present and unfocusable', /id="company"[^>]*tabindex="-1"/.test(hg));
ok('inputs are 16px, so iOS does not zoom on focus', /\.inp, \.sel \{[^}]*font-size: 1rem/.test(hg));
ok('no unresolved values', !hg.includes('undefined') && !hg.includes('[object'));
ok('no placeholder content', !/lorem|TODO|PLACEHOLDER|FIXME/i.test(copyOf(hg)));

console.log('\n  …and actually gates');
ok('no vCard link', !hg.includes('contact.vcf'));
ok('no email address', !hg.includes('galang.joaquin.dev@gmail.com'));
ok('no whatsapp number', !hg.includes('wa.me'));
ok('no github / linkedin / venture links',
  !/github\.com|linkedin\.com|trustmop|marahuyo/i.test(hg));
ok('no portrait — the gate leads with the question', !hg.includes('joaquin.webp'));
ok('…and asks it', hg.includes('<h1>Who do I have?</h1>'));
ok('…under its eyebrow', hg.includes('<p class="kicker">Before we get to it</p>'));
ok('…left-aligned to the form below it', /\.gate-head \{ text-align: left; \}/.test(hg));
// The name is still in the <title> and the footer, so the page is attributable
// even though the card's own heading is held back.
ok('still attributable', hg.includes('Joaquin Galang') && hg.includes('joaquingalang.dev'));
console.log(`       gate is ${Buffer.byteLength(hg)} bytes`);

console.log('\n/c card — past the gate');
const rc = await card(req('https://joaquingalang.dev/api/card?s=c&v=1'));
const hc = await rc.text();
ok('200', rc.status === 200);
ok('save contact is present', hc.includes('>Save contact<'));
ok('save contact is a plain anchor (works with JS off)',
  /<a class="cta"[^>]*href="\/c\/contact\.vcf"[^>]*download=/.test(hc));
ok('vcf points at /c', hc.includes('href="/c/contact.vcf"'));
ok('email', hc.includes('mailto:galang.joaquin.dev@gmail.com'));
ok('whatsapp uses E.164 digits', hc.includes('https://wa.me/639156175207'));
ok('all five links render', ['Portfolio', 'GitHub', 'LinkedIn', 'TrustMop', 'Marahuyo Studios']
  .every((l) => hc.includes(`<span>${l}</span>`)));
ok('surface tagged for analytics', hc.includes("surface: 'c'"));
ok('the form is gone', !hc.includes('<form'));
ok('the portrait and name live here now', hc.includes('joaquin.webp') && hc.includes('<h1>Joaquin Galang</h1>'));
ok('no unresolved values', !hc.includes('undefined') && !hc.includes('[object'));
ok('no placeholder content', !/lorem|TODO|PLACEHOLDER|FIXME/i.test(copyOf(hc)));
console.log(`       card is ${Buffer.byteLength(hc)} bytes`);

console.log('\n/e surface');
const he = await (await card(req('https://joaquingalang.dev/api/card?s=e&v=1'))).text();
ok('vcf points at /e', he.includes('href="/e/contact.vcf"'));
ok('distinguishable in layer 2', he.includes("surface: 'e'"));
const heg = await (await card(req('https://joaquingalang.dev/api/card?s=e'))).text();
ok('/e is gated too', heg.includes('<form class="gate" method="post" action="/e">'));
ok('/e skip goes to /e', heg.includes('href="/e?v=1"'));

console.log('\nsubmitting the gate');
const rOk = await post('c', { name: 'Maria Santos', t: UNHURRIED() });
ok('303, so a refresh cannot re-submit', rOk.status === 303);
ok('lands on the card', rOk.headers.get('location') === '/c?v=1');
ok('never cached', rOk.headers.get('cache-control') === 'no-store');

const rNoName = await post('c', { name: '   ', reach: 'a@b.com', t: UNHURRIED() });
ok('a blank name re-renders the gate', rNoName.status === 422);
const hNoName = await rNoName.text();
ok('…and says so without scolding', hNoName.includes('A name first, then the card is yours.'));
ok('…and is still a working form', hNoName.includes('<form class="gate"'));

ok('/e submissions land back on /e',
  (await post('e', { name: 'Maria Santos', t: UNHURRIED() })).headers.get('location') === '/e?v=1');

console.log('\nwhat reaches the store');
// Capture the Redis calls so the filtering is observable rather than assumed.
process.env.UPSTASH_REDIS_REST_URL = 'https://capture.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
const realFetch = globalThis.fetch;
let writes = [];
globalThis.fetch = async (_url, init) => {
  writes.push(JSON.parse(init.body));
  return new Response('{"result":1}', { status: 200 });
};
const leads = () => writes.filter((w) => w[0] === 'RPUSH');
const reset = () => { writes = []; };

reset();
await post('c', {
  name: '  Maria   Santos  ',
  met: 'A hackathon',
  intent: ['Hiring', 'Collaborating'],
  reach: 'maria@example.com',
  note: 'We talked about the Flutter workshop',
  t: UNHURRIED(),
});
ok('one lead written', leads().length === 1);
const lead = leads().length ? JSON.parse(leads()[0][2]) : {};
ok('to leads:c, not the visit counter', leads()[0]?.[1] === 'leads:c');
ok('name is trimmed and collapsed', lead.name === 'Maria Santos');
ok('met', lead.met === 'A hackathon');
ok('intent keeps both', Array.isArray(lead.intent) && lead.intent.length === 2);
ok('reach', lead.reach === 'maria@example.com');
ok('note', lead.note === 'We talked about the Flutter workshop');
ok('timestamped', typeof lead.ts === 'number' && lead.ts > 0);
ok('device class, not a raw user-agent', lead.device === 'mobile' && !JSON.stringify(lead).includes('AppleWebKit'));
ok('no ip, no cookie, no user-agent stored',
  !/ip|cookie|userAgent|user-agent/i.test(Object.keys(lead).join(',')));

reset();
await post('c', { name: 'Bot', company: 'Acme Corp', t: UNHURRIED() });
ok('honeypot submission is dropped', leads().length === 0);
ok('…but is not told so', writes.length >= 0);

reset();
await post('c', { name: 'Speedy', t: String(Date.now()) });
ok('a submission faster than a person can type is dropped', leads().length === 0);

reset();
await post('c', { name: 'Maria', met: 'Somewhere I typed myself', intent: ['Anything'], t: UNHURRIED() });
const forged = leads().length ? JSON.parse(leads()[0][2]) : {};
ok('an unknown "met" value is discarded, not stored', forged.met === '');
ok('an unknown intent value is discarded', Array.isArray(forged.intent) && forged.intent.length === 0);

reset();
await card(req('https://joaquingalang.dev/api/card?s=c'));
const gateVisits = writes.filter((w) => w[0] === 'ZADD' && w[1] === 'visits:c').length;
reset();
await card(req('https://joaquingalang.dev/api/card?s=c&v=1'));
const revealVisits = writes.filter((w) => w[0] === 'ZADD' && w[1] === 'visits:c').length;
ok('the gate counts as a visit', gateVisits === 1);
ok('the reveal does not, so saves ÷ visits stays honest', revealVisits === 0);

globalThis.fetch = realFetch;

console.log('\nmethods');
const rh = await card(req('https://joaquingalang.dev/api/card?s=c', { method: 'HEAD' }));
ok('HEAD returns headers only', rh.status === 200 && rh.body === null);
const rput = await card(req('https://joaquingalang.dev/api/card?s=c', { method: 'PUT' }));
ok('PUT is rejected', rput.status === 405);
ok('…and advertises POST now that the gate exists',
  rput.headers.get('allow') === 'GET, HEAD, POST');

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
ok('reachable without passing the gate, by design', rv.status === 200);

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
const rBadGate = await card(req('https://joaquingalang.dev/api/card?s=c'));
ok('the gate still renders with a dead store',
  rBadGate.status === 200 && (await rBadGate.text()).includes('<form class="gate"'));
const rBad = await card(req('https://joaquingalang.dev/api/card?s=c&v=1'));
ok('the card still renders with a dead store',
  rBad.status === 200 && (await rBad.text()).includes('>Save contact<'));
const rBadPost = await post('c', { name: 'Maria Santos', t: UNHURRIED() });
ok('a submission still gets past the gate with a dead store', rBadPost.status === 303);
let threw = false;
try {
  await recordEvent(req('https://joaquingalang.dev/c'), 'c', 'visit');
} catch {
  threw = true;
}
ok('a failed write never rejects', !threw);

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}\n`);
process.exit(failures ? 1 : 0);
