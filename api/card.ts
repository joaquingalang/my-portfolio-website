/**
 * The QR calling-card landing page, served at `/c` (print) and `/e` (events).
 *
 * Why this is a Vercel Function returning hand-written HTML rather than a route
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
 *
 * ## The gate
 *
 * Both surfaces open on a short form asking who is scanning, and the contact
 * details sit behind it. That is a deliberate trade: it costs some share of the
 * saves — the ratio to watch is `saves:c ÷ visits:c` — in exchange for knowing
 * who the scan was.
 *
 * It is a real `<form method="post">`, not a JavaScript reveal, because the
 * no-JavaScript guarantee above is the whole reason this file exists. The three
 * states are all server-rendered:
 *
 *   GET  /c          the gate
 *   POST /c          record the lead, then 303 to the card
 *   GET  /c?v=1      the card
 *
 * `?v=1` is set by the Skip link and by that redirect, never by the QR — the
 * printed URL stays bare `/c`, which is what keeps the code low-density. Only
 * the gate GET counts as a visit, so the redirect cannot double-count.
 */
import { waitUntil } from '@vercel/functions';
import { recordEvent, recordLead, type Lead } from './_lib/analytics.js';
import {
  EMAIL,
  FULL_NAME,
  INTENT_OPTIONS,
  LINKS,
  MET_OPTIONS,
  SITE_URL,
  TAGLINE,
  TITLE,
  WHATSAPP_URL,
  isKnown,
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
    --text-25: rgba(246, 247, 255, 0.25);
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
    border: 0;
    border-radius: 999px;
    background: var(--accent);
    color: var(--base);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
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

  /* ---------------------------- the gate ---------------------------- */

  /* The gate leads with the question and nothing else — no portrait, no name.
     Someone who just scanned a card already knows whose it is, and opening on
     a face above a form makes the form feel like the price of the face. The
     photo and the name belong to the card behind it.

     Left-aligned against the card's centred layout, to the same edge as the
     form below: a centred heading sitting over a left-aligned column of labels
     reads as two designs stacked rather than one. */
  .gate-head { text-align: left; }

  .kicker {
    margin: 0 0 0.8rem;
    font-size: 0.72rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--accent);
  }

  .lede {
    margin: 0.85rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--text-70);
  }

  /* Left-aligned against the card's centred layout, because a column of form
     labels centred over its inputs is unreadable at a glance. */
  .gate { text-align: left; margin-top: 1.75rem; }

  .field { margin-top: 1.25rem; }

  .field > .q {
    display: block;
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .field .optional { color: var(--text-45); font-size: 0.8125rem; }

  .inp, .sel {
    width: 100%;
    min-height: 52px;
    padding: 0 1rem;
    border: 1px solid var(--hairline);
    border-radius: 14px;
    background: var(--surface);
    color: var(--text);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 300;
  }

  /* 16px minimum on the inputs above: iOS Safari zooms the viewport on focus
     for anything smaller, and the page never zooms back out. */

  .inp::placeholder { color: var(--text-25); }

  .sel {
    appearance: none;
    background-image:
      linear-gradient(45deg, transparent 50%, rgba(246, 247, 255, 0.45) 50%),
      linear-gradient(135deg, rgba(246, 247, 255, 0.45) 50%, transparent 50%);
    background-position: calc(100% - 20px) 24px, calc(100% - 15px) 24px;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
    padding-right: 2.5rem;
  }

  .sel option { background: var(--surface); color: var(--text); }

  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }

  /* Clipped rather than display:none — a hidden-by-display input is skipped by
     some browsers' form serialisation, and the checked state has to survive. */
  .vh {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 1rem;
    border: 1px solid var(--hairline);
    border-radius: 999px;
    background: var(--surface);
    color: var(--text-70);
    font-size: 0.9375rem;
    cursor: pointer;
    transition: background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s;
  }

  .vh:checked + .chip {
    background: rgba(96, 224, 142, 0.14);
    border-color: rgba(96, 224, 142, 0.5);
    color: var(--text);
  }

  .vh:focus-visible + .chip { outline: 2px solid var(--accent); outline-offset: 3px; }

  .skip {
    display: block;
    margin-top: 1rem;
    padding: 0.6rem;
    text-align: center;
    color: var(--text-45);
    font-size: 0.9375rem;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .fineprint {
    margin: 1.25rem 0 0;
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--text-25);
    text-align: center;
  }

  .error {
    margin: 1rem 0 0;
    padding: 0.75rem 1rem;
    text-align: left;
    border: 1px solid rgba(96, 224, 142, 0.4);
    border-radius: 14px;
    background: rgba(96, 224, 142, 0.08);
    color: var(--text-70);
    font-size: 0.875rem;
  }

  /* The honeypot. Never shown, never announced, never focusable. */
  .trap { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition-duration: 0.01ms !important; }
  }
`;

const ARROW =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

const DOWNLOAD =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

/** Head, styles and portrait — everything the two views share. */
function shell(body: string, script = ''): string {
  const description = `${FULL_NAME} — ${TITLE}. ${TAGLINE}`;

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
${body}
  <footer><a href="${escapeHtml(SITE_URL)}">joaquingalang.dev</a></footer>
</main>

<script defer src="/_vercel/insights/script.js"></script>${script}
</body>
</html>`;
}

/** The contact details. Reached by submitting the gate, or by skipping it. */
function renderCard(surface: Surface): string {
  const links = LINKS.map((link) => {
    // Everything but the portfolio itself leaves the site.
    const external = link.href.startsWith(SITE_URL)
      ? ''
      : ' target="_blank" rel="noopener noreferrer"';
    return `<a class="link" href="${escapeHtml(link.href)}"${external}><span>${escapeHtml(
      link.label,
    )}</span>${ARROW}</a>`;
  }).join('');

  const body = `  <img class="avatar" src="/card/joaquin.webp" width="112" height="112" alt="${escapeHtml(
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

  <nav class="links" aria-label="Elsewhere">${links}</nav>`;

  const script = `
<script>
  // Progressive enhancement only. The download works identically when this
  // script is blocked, which on a privacy browser it will be.
  document.getElementById('save-contact').addEventListener('click', function () {
    if (window.va) window.va('event', { name: 'save_contact', data: { surface: '${surface}' } });
  });
</script>`;

  return shell(body, script);
}

/**
 * The gate. `error` is set only when a submission came back without a name,
 * which is the one server-side validation failure a person can actually hit —
 * the browser's own `required` handling catches it first when JS and native
 * validation are available.
 */
function renderGate(surface: Surface, error = ''): string {
  const met = MET_OPTIONS.map(
    (option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`,
  ).join('');

  const intent = INTENT_OPTIONS.map((option, index) => {
    const id = `i${index}`;
    return `<input class="vh" type="checkbox" name="intent" id="${id}" value="${escapeHtml(
      option,
    )}"><label class="chip" for="${id}">${escapeHtml(option)}</label>`;
  }).join('');

  const body = `  <div class="gate-head">
    <p class="kicker">Before we get to it</p>
    <h1>Who do I have?</h1>
    <p class="lede">Two taps and my details are yours. I just like knowing who scanned.</p>
  </div>

  ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
  <form class="gate" method="post" action="/${surface}">
    <div class="field">
      <label class="q" for="name">What&rsquo;s your name?</label>
      <input class="inp" type="text" id="name" name="name" maxlength="80" required
             autocomplete="name" autocapitalize="words" placeholder="Maria Santos">
    </div>

    <div class="field">
      <label class="q" for="met">I met Joaquin at&hellip; <span class="optional">&mdash; optional</span></label>
      <select class="sel" id="met" name="met">
        <option value="" selected>Choose one</option>
        ${met}
      </select>
    </div>

    <div class="field">
      <span class="q" id="intent-label">What are you here for? <span class="optional">&mdash; optional</span></span>
      <div class="chips" role="group" aria-labelledby="intent-label">${intent}</div>
    </div>

    <div class="field">
      <label class="q" for="reach">Where can I reach you? <span class="optional">&mdash; optional</span></label>
      <input class="inp" type="text" id="reach" name="reach" maxlength="120"
             placeholder="Email or LinkedIn">
    </div>

    <div class="field">
      <label class="q" for="note">Anything you want me to remember? <span class="optional">&mdash; optional</span></label>
      <input class="inp" type="text" id="note" name="note" maxlength="140"
             placeholder="We talked about the Flutter workshop">
    </div>

    <div class="trap" aria-hidden="true">
      <label for="company">Company</label>
      <input type="text" id="company" name="company" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="t" value="${Date.now()}">

    <button class="cta" type="submit">Continue</button>
    <a class="skip" href="/${surface}?v=1">Skip, just show me the card</a>

    <p class="fineprint">This goes to Joaquin&rsquo;s inbox. Nowhere else.</p>
  </form>`;

  return shell(body);
}

/** Trim, collapse whitespace, and cap — applied to every free-text field. */
const clean = (value: FormDataEntryValue | null, max: number): string =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';

/**
 * Turns a submitted form into a `Lead`, or returns null when the submission
 * should be silently dropped: the honeypot was filled, or it arrived faster
 * than a person can type a name. Both cases still get the normal redirect, so
 * a bot cannot tell it was ignored.
 */
function readLead(form: FormData): Lead | null {
  if (clean(form.get('company'), 80)) return null;

  const started = Number(form.get('t'));
  if (Number.isFinite(started) && Date.now() - started < 1200) return null;

  const name = clean(form.get('name'), 80);
  if (!name) return null;

  const met = clean(form.get('met'), 80);
  const intent = form
    .getAll('intent')
    .map((value) => clean(value, 80))
    // Both list-backed fields are checked against the source of truth rather
    // than stored as sent, so nothing a stranger typed can reach the store
    // through them.
    .filter((value) => isKnown(INTENT_OPTIONS, value));

  return {
    name,
    met: isKnown(MET_OPTIONS, met) ? met : '',
    intent,
    reach: clean(form.get('reach'), 120),
    note: clean(form.get('note'), 140),
  };
}

/** Shared by every response: this page is never cached and never indexed. */
const headers = (extra: Record<string, string> = {}): Record<string, string> => ({
  // Every scan must reach this function to be counted.
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  ...extra,
});

const html = (body: string | null, status = 200): Response =>
  new Response(body, { status, headers: headers({ 'Content-Type': 'text/html; charset=utf-8' }) });

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // `?s=` is set by the rewrite in vercel.json and never appears in the printed
  // URL — query strings inflate QR density and some scanners strip them.
  const requested = url.searchParams.get('s');
  const surface: Surface = isSurface(requested) ? requested : 'c';

  if (request.method === 'POST') {
    let lead: Lead | null = null;
    let named = false;
    try {
      const form = await request.formData();
      named = Boolean(clean(form.get('name'), 80));
      lead = readLead(form);
    } catch {
      // A body we cannot parse is not worth failing the page over — fall
      // through to the card, which is where the person was heading anyway.
    }

    // The one failure a person can actually reach. Everything else — a bot, a
    // stale timestamp, an unparseable body — is dropped quietly and let past.
    if (!named) {
      return html(renderGate(surface, 'A name first, then the card is yours.'), 422);
    }

    if (lead) waitUntil(recordLead(request, surface, lead));

    // POST/redirect/GET, so a refresh on the card does not re-submit.
    return new Response(null, {
      status: 303,
      headers: headers({ Location: `/${surface}?v=1` }),
    });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: headers({ Allow: 'GET, HEAD, POST' }),
    });
  }

  // Set by the Skip link and by the redirect above — never by the QR code.
  const revealed = url.searchParams.get('v') === '1';

  // Only the gate is a visit. Counting the reveal as well would double every
  // number in `visits:*` and quietly break `saves:c ÷ visits:c`, which is the
  // ratio the whole card is judged on.
  if (!revealed) {
    // Fire and forget. `recordEvent` never rejects, and `waitUntil` lets it
    // finish after the response has been sent, so it cannot add latency.
    waitUntil(recordEvent(request, surface, 'visit'));
  }

  const body = revealed ? renderCard(surface) : renderGate(surface);

  return html(request.method === 'HEAD' ? null : body);
}

/**
 * Node runtime (Fluid compute), not Edge: Vercel now recommends it, and it is
 * what lets the function be pinned to Singapore near the people scanning the
 * card. The `fetch` Web Standard export is the signature /api expects.
 */
export default { fetch: handler };
