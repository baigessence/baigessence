"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle className="h-8 w-8 text-gold-dark" />
        </div>
        <h3 className="font-serif text-2xl text-charcoal">Message Sent!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[10px] font-medium tracking-widest text-muted uppercase">
            Full Name
          </label>
          <input id="name" name="name" type="text" required className="input-field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-[10px] font-medium tracking-widest text-muted uppercase">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field" placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-[10px] font-medium tracking-widest text-muted uppercase">
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" className="input-field" placeholder="+92 300 0000000" />
      </div>
      <div>
        <label htmlFor="subject" className="mb-2 block text-[10px] font-medium tracking-widest text-muted uppercase">
          Subject
        </label>
        <select id="subject" name="subject" required className="input-field">
          <option value="">Select a topic</option>
          <option value="order">Order Inquiry</option>
          <option value="product">Product Question</option>
          <option value="wholesale">Wholesale / Bulk Order</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-[10px] font-medium tracking-widest text-muted uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input-field resize-none"
          placeholder="How can we help you?"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Sending..." : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
