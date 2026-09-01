/**
 * The QR calling-card landing page, served at `/c` (print) and `/e` (events).
 *
 * Why this is an Edge Function returning hand-written HTML rather than a route
 * in the React app:
 *
 *  - The site is a static Vite SPA with no router and no server. A page in it
 *    could not increment a server-side counter, and would show a blank screen
 *    until JS hydrated — on a conference 3G connection, that is the whole
 *    thirty seconds this page gets.
 *  - Rendering here means the document is complete on arrival and the visit is
 *    counted during the request, so both work with JavaScript disabled.
 *
 * The cost is that this file does not inherit the design system automatically.
 * The palette, type and focus rules below are copied from `.impeccable.md` and
 * `src/index.css` deliberately; if those change, change them here too.
 */
import { waitUntil } from '@vercel/functions';
import { recordEvent } from './_lib/analytics.js';
import {
  EMAIL,
  FULL_NAME,
  LINKS,
  SITE_URL,
  TAGLINE,
  TITLE,
  WHATSAPP_URL,
  isSurface,
  type Surface,
} from './_lib/profile.js';

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });

/** Inlined so the page needs no stylesheet request of its own. */
const styles = `
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --base: #0B0B0D;
    --surface: #141515;
    --elevated: #1B1D1C;
    --accent: #60e08e;
    --text: #F6F7FF;
    --text-70: rgba(246, 247, 255, 0.70);
    --text-45: rgba(246, 247, 255, 0.45);
    --hairline: rgba(246, 247, 255, 0.10);
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    background: var(--base);
    color: var(--text);
    font-family: Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: transparent;
  }

  /* One focus indicator for the whole page, matching the rest of the site.
     Never removed, only restyled. */
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 4px;
  }

  ::selection { background: var(--accent); color: var(--base); }

  .card { width: 100%; max-width: 26rem; text-align: center; }

  /* Intrinsic size declared so the LCP image reserves its box before decode.
     "No layout shift on load" is a stated non-negotiable. */
  .avatar {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--hairline);
    display: block;
    margin: 0 auto 1.25rem;
  }

  h1 {
    margin: 0;
    font-family: Sarpanch, ui-sans-serif, system-ui, sans-serif;
    font-weight: 700;
    font-size: clamp(1.75rem, 1.45rem + 1.5vw, 2.25rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* All caps, carrying over the tracking and accent colour from the site's
     eyebrow treatment. The wide letter-spacing is doing the work here — caps
     without it read as shouting rather than as a label. */
  .role {
    margin: 0.65rem 0 0;
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--accent);
  }

  .tagline {
    margin: 0.85rem 0 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-70);
  }

  /* The one job of this page. Everything above it is context for this tap. */
  .cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    min-height: 56px;
    margin-top: 1.75rem;
    padding: 0 1.5rem;
    border-radius: 999px;
    background: var(--accent);
    color: var(--base);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .cta:active { transform: scale(0.98); }

  .row { display: flex; gap: 0.75rem; margin-top: 0.75rem; }

  .btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding: 0 1rem;
    border: 1px solid rgba(246, 247, 255, 0.15);
    border-radius: 999px;
    background: rgba(246, 247, 255, 0.05);
    color: var(--text);
    font-size: 0.9375rem;
    font-weight: 400;
    text-decoration: none;
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .btn:active { transform: scale(0.98); }

  .links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.75rem;
    text-align: left;
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 56px;
    padding: 0 1.125rem;
    border: 1px solid var(--hairline);
    border-radius: 14px;
    background: var(--surface);
    color: var(--text);
    font-size: 0.9375rem;
    font-weight: 400;
    text-decoration: none;
    transition: background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .link:active { background: var(--elevated); }
  .link svg { flex: none; color: var(--text-45); }

  footer {
    margin-top: 2rem;
    font-size: 0.8125rem;
    color: var(--text-45);
  }

  footer a { color: inherit; text-decoration: none; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition-duration: 0.01ms !important; }
  }
`;

const ARROW =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

const DOWNLOAD =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

function renderCard(surface: Surface): string {
  const description = `${FULL_NAME} — ${TITLE}. ${TAGLINE}`;

  const links = LINKS.map((link) => {
    // Everything but the portfolio itself leaves the site.
    const external = link.href.startsWith(SITE_URL)
      ? ''
      : ' target="_blank" rel="noopener noreferrer"';
    return `<a class="link" href="${escapeHtml(link.href)}"${external}><span>${escapeHtml(
      link.label,
    )}</span>${ARROW}</a>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0B0B0D">
<title>${escapeHtml(FULL_NAME)} — ${escapeHtml(TITLE)}</title>
<meta name="description" content="${escapeHtml(description)}">
<!-- A calling card, not a page that should surface in search. -->
<meta name="robots" content="noindex">
<link rel="icon" href="/portfolio_icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&amp;family=Sarpanch:wght@700&amp;display=swap">
<style>${styles}</style>
</head>
<body>
<main class="card">
  <img class="avatar" src="/card/joaquin.webp" width="112" height="112" alt="${escapeHtml(
    FULL_NAME,
  )}" fetchpriority="high" decoding="async">
  <h1>${escapeHtml(FULL_NAME)}</h1>
  <p class="role">${escapeHtml(TITLE)}</p>
  <p class="tagline">${escapeHtml(TAGLINE)}</p>

  <a class="cta" id="save-contact" href="/${surface}/contact.vcf" download="joaquin-galang.vcf">${DOWNLOAD}<span>Save contact</span></a>

  <div class="row">
    <a class="btn" href="mailto:${escapeHtml(EMAIL)}">Email</a>
    <a class="btn" href="${escapeHtml(
      WHATSAPP_URL,
    )}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
  </div>

  <nav class="links" aria-label="Elsewhere">${links}</nav>

  <footer><a href="${escapeHtml(SITE_URL)}">joaquingalang.dev</a></footer>
</main>

<script defer src="/_vercel/insights/script.js"></script>
<script>
  // Progressive enhancement only. The download works identically when this
  // script is blocked, which on a privacy browser it will be.
  document.getElementById('save-contact').addEventListener('click', function () {
    if (window.va) window.va('event', { name: 'save_contact', data: { surface: '${surface}' } });
  });
</script>
</body>
</html>`;
}

function handler(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  // `?s=` is set by the rewrite in vercel.json and never appears in the printed
  // URL — query strings inflate QR density and some scanners strip them.
  const requested = new URL(request.url).searchParams.get('s');
  const surface: Surface = isSurface(requested) ? requested : 'c';

  // Fire and forget. `recordVisit` never rejects, and `waitUntil` lets it finish
  // after the response has been sent, so it cannot add latency to the page.
  waitUntil(recordEvent(request, surface, 'visit'));

  const html = renderCard(surface);

  return new Response(request.method === 'HEAD' ? null : html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Every scan must reach this function to be counted.
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

/**
 * Node runtime (Fluid compute), not Edge: Vercel now recommends it, and it is
 * what lets the function be pinned to Singapore near the people scanning the
 * card. The `fetch` Web Standard export is the signature /api expects.
 */
export default { fetch: handler };
