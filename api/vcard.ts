/**
 * The vCard, served at `/c/contact.vcf` and `/e/contact.vcf`.
 *
 * Generated per request from `api/_lib/profile.ts` rather than committed as a
 * static file, so the contact details can change without a deploy touching the
 * page — and so the page and the card can never disagree about the email.
 *
 * vCard 3.0, not 4.0: 3.0 is what iOS and Android both handle without argument.
 */
import { waitUntil } from '@vercel/functions';
import { recordEvent } from './_lib/analytics';
import { PHOTO_JPEG_BASE64 } from './_lib/photo';
import {
  EMAIL,
  FIRST_NAME,
  FULL_NAME,
  LAST_NAME,
  PHONE_E164,
  SITE_URL,
  TITLE,
  isSurface,
  type Surface,
} from './_lib/profile';

export const config = { runtime: 'edge' };

/** Escaping for text-typed values only. URI and TEL values are passed through. */
const escapeText = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

/**
 * RFC 2426 line folding: no line over 75 octets, continuations prefixed with a
 * single space. Only the PHOTO line actually needs this, but a parser that
 * chokes on a long line would fail silently and leave the user with a contact
 * that has no photo — or no contact at all.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    parts.push(' ' + line.slice(i, i + 74));
  }
  return parts.join('\r\n');
}

function buildVCard(): string {
  const revision = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeText(LAST_NAME)};${escapeText(FIRST_NAME)};;;`,
    `FN:${escapeText(FULL_NAME)}`,
    `TITLE:${escapeText(TITLE)}`,
    // No ORG. This is the independent card; naming a venture here would put it
    // in the company field of every phone that saves the contact.
    `EMAIL;TYPE=INTERNET,PREF:${EMAIL}`,
    `TEL;TYPE=CELL,VOICE:${PHONE_E164}`,
    `URL:${SITE_URL}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${PHOTO_JPEG_BASE64}`,
    `REV:${revision}`,
    'END:VCARD',
  ];

  // CRLF throughout — the spec requires it, and some Android importers treat a
  // bare LF file as a single malformed line.
  return lines.map(fold).join('\r\n') + '\r\n';
}

export default function handler(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  const requested = new URL(request.url).searchParams.get('s');
  const surface: Surface = isSurface(requested) ? requested : 'c';

  // The save is the number that says whether the card works at all. Recording
  // it here as well as via the client event means it still counts when the
  // analytics script is blocked.
  waitUntil(recordEvent(request, surface, 'save'));

  const body = buildVCard();

  return new Response(request.method === 'HEAD' ? null : body, {
    status: 200,
    headers: {
      // Getting this pair wrong makes iOS render the card as plain text instead
      // of offering to add the contact, which silently defeats the whole page.
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="joaquin-galang.vcf"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
