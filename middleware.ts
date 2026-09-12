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
import { shouldRedirectHomeToCard } from './api/_lib/misprint.js';

export const config = { matcher: '/' };

export default function middleware(request: Request): Response {
  if (shouldRedirectHomeToCard(request)) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/c' },
    });
  }
  return next();
}
