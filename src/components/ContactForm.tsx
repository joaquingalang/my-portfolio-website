import { useRef, useState } from "react";
import emailjs from "emailjs-com";

function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Grab form data manually
    const formData = new FormData(formRef.current);
    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Add time
    const time = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Send via EmailJS
    emailjs
      .send(
        serviceId,
        templateId,
        {
          name: fullName,
          email: email,
          time: time,
          message: message,
        },
        publicKey
      )
      .then(
        () => {
          console.log("Email sent!");
          formRef.current?.reset();
        },
        (error) => {
          console.error("EmailJS Error:", error);
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex flex-col"
    >
      {/* Full Name */}
      <label className="font-chakra text-light text-sm md:text-base lg:text-lg font-medium mb-1">
        Full Name
      </label>
      <input
        type="text"
        name="full_name"
        placeholder="John Doe"
        required
        className="w-full font-poppins text-xs md:text-sm lg:text-base text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-5 rounded-md"
      />

      {/* Email */}
      <label className="font-chakra text-light text-sm md:text-base lg:text-lg font-medium mb-1">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        placeholder="johndoe@gmail.com"
        required
        className="w-full font-poppins text-xs md:text-sm lg:text-base text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-5 rounded-md"
      />

      {/* Message */}
      <label className="font-chakra text-light text-sm md:text-base lg:text-lg font-medium mb-1">
        Message
      </label>
      <textarea
        name="message"
        placeholder="Leave your message here..."
        required
        className="w-full min-h-[15rem] font-poppins text-xs md:text-sm lg:text-base text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-5 rounded-md resize-none"
      />

      {/* Submit Button */}
      <div className="w-full flex justify-end">
        <button
          type="submit"
          disabled={isSending}
          className={`bg-white/10 border-2 border-gray rounded-lg px-5 py-2 font-poppins text-sm md:text-base lg:text-lg text-primary whitespace-nowrap transition ${
            isSending ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"
          }`}
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
