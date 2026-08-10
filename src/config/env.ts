export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
};

/** True only when every EmailJS variable is present, so the contact form can fail loudly instead of silently. */
export const isEmailjsConfigured = Object.values(emailjsConfig).every(Boolean);

if (import.meta.env.DEV && !isEmailjsConfigured) {
  console.warn(
    "[env] Missing EmailJS variables. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in .env — the contact form will not send until then."
  );
}
