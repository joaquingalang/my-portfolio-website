/**
 * The card portrait, base64-encoded, for the vCard PHOTO property.
 *
 * Inlined rather than read from disk because the vCard is served by an Edge
 * Function, which has no filesystem. Source of truth is the 1000x1000 headshot;
 * this is a 192x192 JPEG (~4.7 KB raw, ~6.4 KB encoded) so a saved contact
 * carries a face without bloating the .vcf. A large .vcf makes iOS slow to open
 * the Add Contact sheet, which is the one interaction that must not stall.
 *
 * To regenerate after replacing the headshot, see README "Card assets".
 */
export const PHOTO_JPEG_BASE64 =
  "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" +
  "nYnzKCrK9zlU/BehBUhdhwHovMqjP3h9GqB//9k=";
