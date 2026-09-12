/**
 * Temporary workaround for the first print run of the calling card.
 *
 * The QR on those cards encodes `joaquingalang.dev` instead of
 * `joaquingalang.dev/c`. Until that stock is gone, a phone that opens `/` as a
 * direct navigation is sent to the gate, then a first-party cookie remembers
 * they have already been through it.
 *
 * This is a functional flag, not tracking: the cookie is never written to
 * Redis and never joined to `visits:*` or `leads:*`. The visit counter's "no
 * cookies" contract is unchanged.
 *
 * Kept free of the analytics module so the Edge middleware that imports this
 * file does not pull Redis into its bundle.
 *
 * Turn off without a deploy: `CARD_MISPRINT_REDIRECT=0`.
 */

/** First-party flag that the gate has already been shown on this browser. */
export const GATE_COOKIE = 'cg';

const GATE_COOKIE_VALUE = '1';

/** One year. Long enough to outlast the misprinted stock. */
const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Same deny-list idea as `isNoise` in analytics.ts, duplicated on purpose so
 * this file cannot drag Redis into the middleware bundle. Googlebot-Smartphone
 * has "Mobile" in its UA; without this it would be sent to the noindex gate.
 */
const BOT_UA =
  /bot|crawler|spider|preview|facebookexternalhit|whatsapp|slackbot|twitterbot|discordbot|telegrambot|linkedinbot|googlebot|bingbot|applebot|skypeuripreview|embedly|curl|wget|python-requests|node-fetch|headlesschrome|lighthouse|pingdom|uptime/i;

export function gateCookieHeader(): string {
  return (
    `${GATE_COOKIE}=${GATE_COOKIE_VALUE}; Path=/; Max-Age=${GATE_COOKIE_MAX_AGE}; ` +
    'SameSite=Lax; Secure; HttpOnly'
  );
}

export function hasGateCookie(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? '';
  return new RegExp(`(?:^|;\\s*)${GATE_COOKIE}=${GATE_COOKIE_VALUE}(?:;|$)`).test(
    cookie,
  );
}

function isPhone(ua: string): boolean {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return false;
  return /mobi|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua);
}

function isBotOrPrefetch(request: Request): boolean {
  const ua = request.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA.test(ua)) return true;

  const purpose =
    request.headers.get('sec-purpose') ??
    request.headers.get('purpose') ??
    request.headers.get('x-purpose') ??
    '';
  return /prefetch|preview|prerender/i.test(purpose);
}

/**
 * Phone cameras open a printed URL as a user-initiated navigation: no
 * previous page, so `Sec-Fetch-Site: none` and usually no Referer. Search,
 * social, and in-site clicks are `cross-site` / `same-origin` and must stay
 * on the homepage.
 *
 * When the fetch-site header is missing (older browsers), require no Referer
 * at all — not merely "no external one". A click from the card footer to `/`
 * carries a same-origin Referer; treating that as a scan would bounce the
 * person straight back to the gate.
 */
function isDirectNavigation(request: Request): boolean {
  const site = (request.headers.get('sec-fetch-site') ?? '').toLowerCase();
  if (site === 'none') return true;
  if (site) return false;
  return !request.headers.get('referer');
}

/**
 * True when `/` should 302 to `/c`. Matcher in middleware.ts already limits
 * this to `/`, but the path and query are checked here so the tests do not
 * have to pretend to be Vercel.
 */
export function shouldRedirectHomeToCard(request: Request): boolean {
  if (process.env.CARD_MISPRINT_REDIRECT === '0') return false;
  if (request.method !== 'GET') return false;

  const url = new URL(request.url);
  if (url.pathname !== '/' || url.search !== '') return false;

  if (hasGateCookie(request)) return false;
  if (isBotOrPrefetch(request)) return false;
  if (!isPhone(request.headers.get('user-agent') ?? '')) return false;

  return isDirectNavigation(request);
}
