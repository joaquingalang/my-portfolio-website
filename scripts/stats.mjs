#!/usr/bin/env node
/**
 * Reads back both analytics layers from the terminal.
 *
 *   node scripts/stats.mjs            # last 30 days
 *   node scripts/stats.mjs --days 7
 *   node scripts/stats.mjs --fresh    # bypass the 1-hour Vercel API cache
 *
 * This is a LOCAL script and is never bundled or deployed. The Vercel token is
 * account-scoped, so it must never reach a browser: note that none of the
 * variables below are `VITE_`-prefixed, because Vite inlines anything that is
 * into the client bundle.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = resolve(root, 'node_modules/.tmp/analytics-cache.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // The Vercel API asks for >= 1 hour.

/** Minimal .env reader — not worth a dependency for five variables. */
function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const path = resolve(root, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  }
}

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const days = Number(flag('days', 30));
const fresh = args.includes('--fresh');

loadEnv();

const since = Date.now() - days * 86_400_000;

// ---------------------------------------------------------------------------
// Layer 1 — the server-side counter. The number to trust.
// ---------------------------------------------------------------------------

async function layerOne() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.log('  (no Redis credentials in .env — skipping)\n');
    return;
  }

  const keys = ['visits:c', 'visits:e', 'saves:c', 'saves:e'];
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ...keys.map((k) => ['ZCARD', k]),
      ...keys.map((k) => ['ZRANGEBYSCORE', k, String(since), '+inf']),
    ]),
  });

  if (!response.ok) {
    console.log(`  Redis error ${response.status}: ${await response.text()}\n`);
    return;
  }

  const results = await response.json();
  const totals = keys.map((_, i) => results[i].result ?? 0);
  const windows = keys.map((_, i) => results[keys.length + i].result ?? []);

  console.log(`  ${'key'.padEnd(12)} ${'all time'.padStart(9)} ${`last ${days}d`.padStart(9)}`);
  keys.forEach((key, i) => {
    console.log(`  ${key.padEnd(12)} ${String(totals[i]).padStart(9)} ${String(windows[i].length).padStart(9)}`);
  });

  // Per-day, so "did the batch I handed out at that event do anything" is
  // answerable. Members are `ts|referrerHost|deviceClass|rand`.
  const byDay = new Map();
  windows[0].concat(windows[1]).forEach((member) => {
    const day = new Date(Number(member.split('|')[0])).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  });

  if (byDay.size) {
    console.log('\n  visits per day');
    [...byDay.entries()].sort().forEach(([day, count]) => {
      console.log(`  ${day}  ${'#'.repeat(Math.min(count, 40))} ${count}`);
    });
  }

  const referrers = new Map();
  windows[0].concat(windows[1]).forEach((member) => {
    const host = member.split('|')[1];
    referrers.set(host, (referrers.get(host) ?? 0) + 1);
  });
  if (referrers.size) {
    console.log('\n  referrers');
    [...referrers.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([host, count]) => console.log(`  ${String(count).padStart(5)}  ${host}`));
  }
  console.log('');
}

// ---------------------------------------------------------------------------
// Layer 2 — Vercel Web Analytics. Texture, not volume.
// ---------------------------------------------------------------------------

function readCache() {
  if (fresh || !existsSync(CACHE)) return {};
  try {
    const cached = JSON.parse(readFileSync(CACHE, 'utf8'));
    return Date.now() - cached.at < CACHE_TTL_MS ? cached.data : {};
  } catch {
    return {};
  }
}

function writeCache(data) {
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify({ at: Date.now(), data }, null, 2));
}

async function layerTwo() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    console.log('  (no VERCEL_ANALYTICS_TOKEN / VERCEL_PROJECT_ID in .env — skipping)\n');
    return;
  }

  const cache = readCache();
  const results = {};

  const queries = {
    'visits by day (/c)': ['visits/aggregate', { by: 'day', filter: "requestPath eq '/c'" }],
    'visits by country (/c)': ['visits/aggregate', { by: 'country', filter: "requestPath eq '/c'" }],
    'visits by referrer (/c)': ['visits/aggregate', { by: 'referrerHostname', filter: "requestPath eq '/c'" }],
    'save_contact events': ['events/aggregate', { by: 'eventName', filter: "eventName eq 'save_contact'" }],
  };

  for (const [label, [path, extra]] of Object.entries(queries)) {
    if (cache[label]) {
      results[label] = cache[label];
      console.log(`  ${label} (cached)`);
    } else {
      const params = new URLSearchParams({
        projectId,
        since: String(since),
        until: String(Date.now()),
        ...extra,
      });
      if (teamId) params.set('teamId', teamId);

      const response = await fetch(
        `https://api.vercel.com/v1/query/web-analytics/${path}?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) {
        console.log(`  ${label}: HTTP ${response.status} — ${await response.text()}`);
        continue;
      }
      results[label] = await response.json();
      console.log(`  ${label}`);
    }
    console.log(`    ${JSON.stringify(results[label])}\n`);
  }

  writeCache(results);
}

console.log(`\nCalling card — last ${days} days\n`);
console.log('Layer 1 — server-side counter (trusted)\n');
await layerOne();
console.log('Layer 2 — Vercel Web Analytics (texture)\n');
await layerTwo();
