#!/usr/bin/env node
/**
 * Local preview server for the calling card.
 *
 *   npm run card        # http://localhost:4321/c
 *
 * `npm run dev` runs Vite, which serves the SPA but knows nothing about `/api`,
 * so the card is invisible to it. `vercel dev` would work but needs the project
 * linked and an auth round-trip. This is the fast path: it bundles the Edge
 * Functions with esbuild and applies the real rewrites from vercel.json, so the
 * routing being previewed is the routing that ships.
 *
 * Not deployed and not part of the build — a local tool only.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outdir = resolve(root, 'node_modules/.tmp/card-dev');
const port = Number(process.env.PORT ?? 4321);

const MIME = {
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json',
};

await mkdir(outdir, { recursive: true });

// `waitUntil` only exists inside Vercel's runtime; locally the promise just runs.
const stub = resolve(outdir, 'functions-stub.mjs');
await writeFile(stub, 'export function waitUntil(p) { return p; }\n');

async function bundle() {
  await esbuild.build({
    entryPoints: [resolve(root, 'api/card.ts'), resolve(root, 'api/vcard.ts')],
    bundle: true, format: 'esm', platform: 'node',
    outdir, entryNames: `[name]-${Date.now()}`,
    alias: { '@vercel/functions': stub },
    logLevel: 'warning',
  });
}

/** Rewrites are read from vercel.json so this can never drift from production. */
const rewrites = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8')).rewrites;

function match(pathname) {
  const rule = rewrites.find((r) => r.source === pathname);
  if (!rule) return null;
  const url = new URL(rule.destination, 'http://local');
  return { name: url.pathname.replace('/api/', ''), search: url.search };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const route = match(url.pathname);

  if (route) {
    // Rebuild per request so edits show up on refresh.
    const stamp = Date.now();
    await esbuild.build({
      entryPoints: [resolve(root, `api/${route.name}.ts`)],
      bundle: true, format: 'esm', platform: 'node',
      outfile: resolve(outdir, `${route.name}-${stamp}.mjs`),
      alias: { '@vercel/functions': stub }, logLevel: 'warning',
    });
    const mod = await import(pathToFileURL(resolve(outdir, `${route.name}-${stamp}.mjs`)));
    const response = await mod.default(
      new Request(`https://joaquingalang.dev/api/${route.name}${route.search}`, {
        method: req.method,
        headers: req.headers,
      }),
    );
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(response.body ? Buffer.from(await response.arrayBuffer()) : undefined);
    return;
  }

  // Anything else falls through to public/, the way the CDN serves it.
  const file = resolve(root, 'public', `.${url.pathname}`.replace(/^\.\//, ''));
  if (existsSync(file) && !file.endsWith('public')) {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found. Try /c or /e');
});

/**
 * `server.listen(port, cb)` registers cb via `once('listening')`, so a callback
 * passed to a failed attempt would still fire on the successful one and print a
 * banner naming the wrong port. Register the banner once here instead and read
 * the port that was actually bound.
 */
server.on('listening', () => {
  console.log('');
  console.log('  Calling card preview');
  rewrites.forEach((r) =>
    console.log(`  http://localhost:${server.address().port}${r.source}`),
  );
  console.log('');
  console.log('  ctrl-c to stop');
  console.log('');
});

/**
 * A previous run that was killed by its wrapper rather than directly can leave
 * the port held. Step to the next one instead of dying with a stack trace.
 */
function listen(candidate, attemptsLeft = 10) {
  server.once('error', (error) => {
    if (error.code !== 'EADDRINUSE' || attemptsLeft === 0) throw error;
    console.log(`  port ${candidate} is busy, trying ${candidate + 1}`);
    listen(candidate + 1, attemptsLeft - 1);
  });
  server.listen(candidate);
}

listen(port);

await bundle();
