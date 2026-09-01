/**
 * Layer 1: the server-side visit counter.
 *
 * This is the number to trust. Vercel Analytics (layer 2) is a browser script,
 * so ad blockers and privacy browsers silently drop a share of it — fine for
 * demographics, useless for "how many people scanned the card". This layer runs
 * during the request, before any client JS exists, so a scan counts even with
 * JavaScript disabled entirely.
 *
 * Deliberately not stored: cookies, IP addresses, raw user-agent strings, or
 * anything else that could identify a person. This is a counter, not a profile,
 * and it must stay outside consent-banner territory for a page someone has open
 * for eight seconds.
 */
import type { Surface } from './profile';

/**
 * `visit` is a page load; `save` is an actual .vcf download — the number that
 * says whether the card is doing its job. The save is recorded here as well as
 * via the Vercel Analytics custom event, because this one cannot be blocked.
 */
export type EventKind = 'visit' | 'save';

/**
 * Timestamps, not a running total. A bare integer cannot answer "did the batch
 * I handed out at that event do anything", which is the question actually
 * asked. A sorted set scored by epoch ms answers it with one ZCOUNT.
 */
const key = (kind: EventKind, surface: Surface) =>
  `${kind === 'visit' ? 'visits' : 'saves'}:${surface}`;

/**
 * Link-preview bots and crawlers. A URL that gets pasted into a chat app is
 * fetched by the app before any human sees it, so without this the first number
 * is inflated and there is no way to tell by how much.
 *
 * Short on purpose — this is a deny-list, not a bot-detection system.
 */
const BOT_UA =
  /bot|crawler|spider|preview|facebookexternalhit|whatsapp|slackbot|twitterbot|discordbot|telegrambot|linkedinbot|googlebot|bingbot|applebot|skypeuripreview|embedly|curl|wget|python-requests|node-fetch|headlesschrome|lighthouse|pingdom|uptime/i;

/** Coarse enough to be useless for identification, specific enough to be worth having. */
function deviceClass(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

/** Hostname only. The full referrer can carry a path and query, which we do not want. */
function referrerHost(referer: string | null): string {
  if (!referer) return '-';
  try {
    return new URL(referer).hostname || '-';
  } catch {
    return '-';
  }
}

/**
 * True when this request should not be counted: a bot, or a speculative fetch
 * the browser made before the person decided to open anything.
 */
export function isNoise(request: Request): boolean {
  if (request.method === 'HEAD') return true;

  const ua = request.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA.test(ua)) return true;

  const purpose =
    request.headers.get('sec-purpose') ??
    request.headers.get('purpose') ??
    request.headers.get('x-purpose') ??
    '';
  return /prefetch|preview|prerender/i.test(purpose);
}

function credentials(): { url: string; token: string } | null {
  const env = process.env;
  // The Vercel Marketplace integration provisions the UPSTASH_* pair; the older
  // Vercel-KV-branded one provisions KV_REST_API_*. Accept either so moving
  // between them never needs a code change.
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

/**
 * Records one event. Returns a promise for the caller to hand to `waitUntil`.
 *
 * Never throws and never blocks the response. A tracking failure must never be
 * a user-visible failure — if the store is unreachable or misconfigured, the
 * page still renders and this quietly does nothing.
 */
export function recordEvent(
  request: Request,
  surface: Surface,
  kind: EventKind = 'visit',
): Promise<void> {
  if (isNoise(request)) return Promise.resolve();

  const creds = credentials();
  if (!creds) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[card] no Redis credentials; ${kind} not recorded`);
    }
    return Promise.resolve();
  }

  const ts = Date.now();
  const ua = request.headers.get('user-agent') ?? '';
  // The random suffix keeps two visits in the same millisecond from collapsing
  // into one member — a sorted set dedupes by member, not by score.
  const member = [
    ts,
    referrerHost(request.headers.get('referer')),
    deviceClass(ua),
    Math.random().toString(36).slice(2, 8),
  ].join('|');

  return fetch(creds.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${creds.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['ZADD', key(kind, surface), ts, member]),
    // A slow store must not keep the function alive indefinitely.
    signal: AbortSignal.timeout(2000),
  }).then(
    () => undefined,
    (error: unknown) => {
      console.error(`[card] ${kind} not recorded:`, error);
    },
  );
}
