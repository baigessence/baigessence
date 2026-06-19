"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-cream-dark" />
      <div className="absolute top-0 left-1/2 h-px w-32 -translate-x-1/2 bg-gold" />

      <div className="relative mx-auto max-w-2xl px-4 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
          <Mail className="h-6 w-6 text-gold-dark" />
        </div>
        <p className="text-[11px] tracking-[0.35em] text-gold uppercase">Stay Connected</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Join the BaigEssence Family</h2>
        <p className="mt-4 text-muted leading-relaxed">
          Exclusive offers, new arrivals, and fragrance tips — delivered to your inbox.
        </p>

        {submitted ? (
          <p className="mt-8 font-serif text-xl text-gold">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="input-field flex-1 text-center sm:text-left"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        )}
        <p className="mt-4 text-[10px] tracking-wider text-muted/70 uppercase">
          No spam · Unsubscribe anytime
        </p>
      </div>
    </section>
  );
}
