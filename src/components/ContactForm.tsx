import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { emailjsConfig, isEmailjsConfigured } from "../config/env";
import { CONTACT_EMAIL } from "../data/contact";
import Button from "./Button";
import { cn } from "../utils/cn";

/* `outline-none` is deliberately absent — the global :focus-visible ring is the
   only focus indicator and utilities would override it. Placeholder sits at 45%
   rather than the previous 10%, which was invisible against the field. */
const FIELD_CLASS =
  "w-full rounded-lg border border-light/10 bg-surface px-4 py-3 font-poppins text-base text-light " +
  "placeholder-light/45 transition-colors duration-200 hover:border-light/20 focus:border-primary/60";

const LABEL_CLASS = "mb-2 block font-chakra text-sm font-medium text-light md:text-base";

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-1 text-primary">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!isEmailjsConfigured) {
      setStatus("error");
      return;
    }

    setIsSending(true);
    setStatus("idle");

    const formData = new FormData(formRef.current);
    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const time = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    emailjs
      .send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          name: fullName,
          email: email,
          time: time,
          message: message,
        },
        emailjsConfig.publicKey
      )
      .then(
        () => {
          setStatus("success");
          formRef.current?.reset();
        },
        () => {
          setStatus("error");
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex w-full flex-col">
      <div className="mb-5">
        <label htmlFor="contact-full-name" className={LABEL_CLASS}>
          Full Name
          <RequiredMark />
        </label>
        <input
          id="contact-full-name"
          type="text"
          name="full_name"
          autoComplete="name"
          placeholder="John Doe"
          required
          className={FIELD_CLASS}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="contact-email" className={LABEL_CLASS}>
          Email Address
          <RequiredMark />
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="johndoe@gmail.com"
          required
          className={FIELD_CLASS}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          Message
          <RequiredMark />
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell me about your project, timeline, and what you need help with."
          required
          rows={6}
          className={cn(FIELD_CLASS, "min-h-[10rem] resize-y")}
        />
      </div>

      <div role="status" aria-live="polite">
        {status === "success" && (
          <p className="mb-4 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 font-poppins text-sm text-primary">
            <CheckCircle2 size={18} aria-hidden="true" className="mt-px shrink-0" />
            Message sent — I&rsquo;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="mb-4 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 font-poppins text-sm text-red-300">
            <AlertCircle size={18} aria-hidden="true" className="mt-px shrink-0" />
            <span>
              That didn&rsquo;t go through. Try again, or email me directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          </p>
        )}
      </div>

      <div className="flex w-full justify-end">
        <Button type="submit" disabled={isSending} aria-busy={isSending}>
          {isSending ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
              Sending&hellip;
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default ContactForm;
