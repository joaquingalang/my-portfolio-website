/**
 * Intercepts `/` for the misprinted calling-card QR.
 *
 * Phones that open `joaquingalang.dev` (no path) are sent to `/c`, or to
 * `/c?v=1` if that browser already submitted the gate. Desktop stays on the
 * homepage. See `api/_lib/misprint.ts`.
 *
 * Matcher is `/` only, so `/c`, `/e`, and static assets never enter here.
 */
import { next } from '@vercel/functions';
import {
  homeRedirectLocation,
  homeSourceCookieHeader,
  shouldRedirectHomeToCard,
} from './api/_lib/misprint.js';

export const config = {
  // Node, not Edge: same runtime as `/api/card`, and the `proxy.entrypoint`
  // path Vercel documents for non-Next frameworks (Vite included).
  runtime: 'nodejs',
  matcher: '/',
};

export default function middleware(request: Request): Response {
  if (shouldRedirectHomeToCard(request)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: homeRedirectLocation(request),
        // Tags a later gate submit as a misprint-path lead. Separate from
        // `cg=1`, which is set only after a successful POST.
        'Set-Cookie': homeSourceCookieHeader(),
      },
    });
  }
  return next();
}
