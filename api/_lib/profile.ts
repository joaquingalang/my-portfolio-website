/**
 * Everything the calling card renders, in one place.
 *
 * Both the page (`api/card.ts`) and the vCard (`api/vcard.ts`) read from here,
 * so the two can never drift the way a hand-maintained .vcf would. This mirrors
 * the intent of `src/data/contact.ts`, which the email address is imported from
 * rather than re-declared.
 */
import { CONTACT_EMAIL } from '../../src/data/contact';

/** The surfaces the card is printed on. Same page, separate analytics identity. */
export type Surface = 'c' | 'e';

export function isSurface(value: string | null): value is Surface {
  return value === 'c' || value === 'e';
}

export const FIRST_NAME = 'Joaquin';
export const LAST_NAME = 'Galang';
export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`;

/**
 * Matches the site's own <title>. Deliberately plain: it has to read the same
 * to a hiring manager scanning for a role and to a client who just wants to
 * know what this person does.
 */
export const TITLE = 'Software Developer';

/**
 * No ORG property. This is the independent card — TrustMop and Marahuyo Studios
 * appear below as work, not as an employer, and an invented org line would be
 * worse than none.
 */

/** Condensed from the About section, kept in first person. */
export const TAGLINE =
  'I build mobile apps, web apps, and the automations that connect them.';

export const EMAIL = CONTACT_EMAIL;

export const SITE_URL = 'https://joaquingalang.dev';

/**
 * E.164, because that is the only format `wa.me` and every phone's dialler
 * agree on. 0915... is the same number in Philippine national format.
 */
export const PHONE_E164 = '+639156175207';

/** wa.me wants the E.164 digits with no punctuation and no leading plus. */
export const WHATSAPP_URL = `https://wa.me/${PHONE_E164.replace(/\D/g, '')}`;

export interface CardLink {
  label: string;
  href: string;
}

/**
 * Portfolio leads because it is the link that answers "what does he actually
 * build". The two ventures come last on purpose: they are work samples here,
 * not the subject of the card.
 *
 * Labels only, no descriptions: writing a one-line summary of TrustMop or
 * Marahuyo Studios would mean inventing one, and a wrong description on a card
 * handed to a client is worse than no description.
 */
export const LINKS: CardLink[] = [
  { label: 'Portfolio', href: SITE_URL },
  { label: 'GitHub', href: 'https://github.com/joaquingalang' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joaquin-galang/' },
  { label: 'TrustMop', href: 'https://trustmop.net' },
  { label: 'Marahuyo Studios', href: 'https://marahuyostudios.com' },
];
