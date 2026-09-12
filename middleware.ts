/**
 * Intercepts `/` for the misprinted calling-card QR.
 *
 * Phone cameras that open `joaquingalang.dev` (no path) are sent to `/c`.
 * Everyone else — desktop, referred traffic, bots, people who already passed
 * the gate — is left on the homepage. See `api/_lib/misprint.ts`.
 *
 * Matcher is `/` only, so `/c`, `/e`, and static assets never enter here.
 */
import { next } from '@vercel/functions';
import {
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
        Location: '/c',
        // Tags the upcoming gate submit as a misprint-path lead. Separate
        // from `cg=1`, which is set only after skip/submit.
        'Set-Cookie': homeSourceCookieHeader(),
      },
    });
  }
  return next();
}
