import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle, Truck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import { contactImages } from "@/lib/images";
import {
  getWhatsAppUrl,
  SITE_ADDRESS,
  SITE_CITY,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_PHONE_DISPLAY,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Baig Essence. Visit us in Lahore or reach us by phone, email, or WhatsApp.",
};

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    lines: [SITE_PHONE_DISPLAY, "Mon–Sat, 10am–8pm"],
    href: `tel:${SITE_PHONE}`,
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [SITE_EMAIL, "We reply within 24 hours"],
    href: `mailto:${SITE_EMAIL}`,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [SITE_ADDRESS, SITE_CITY],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: [SITE_PHONE_DISPLAY, "Quick responses"],
    href: getWhatsAppUrl(),
  },
];

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Lahore: 2–3 days. Other cities: 3–5 business days.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes, on all orders above Rs. 3,000.",
  },
  {
    q: "Can I return a fragrance?",
    a: "See our Refund & Exchange Policy for eligibility within 7 days of delivery.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="We'd Love to Hear From You"
        description="Questions about an order, a fragrance, or a bulk purchase? Our team is ready to help."
        image={contactImages.hero}
        imageAlt="Contact Baig Essence"
      />

      <section className="relative z-10 -mt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map(({ icon: Icon, title, lines, href }) => {
              const content = (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-colors group-hover:bg-gold/10">
                    <Icon className="h-5 w-5 text-gold-dark" />
                  </div>
                  <h3 className="font-serif text-lg text-charcoal">{title}</h3>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm text-muted">
                      {line}
                    </p>
                  ))}
                </>
              );

              if (!href) {
                return (
                  <div key={title} className="card-luxury flex flex-col p-6">
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={title}
                  href={href}
                  className="card-luxury group flex flex-col p-6 transition-transform hover:-translate-y-1"
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-3">
              <SectionHeading
                align="left"
                eyebrow="Send a Message"
                title="Contact Form"
                description="Fill out the form and we'll respond as soon as possible."
                className="mb-8"
              />
              <div className="border border-charcoal/5 bg-cream/20 p-6 md:p-10">
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-2">
              <SectionHeading
                align="left"
                eyebrow="Quick Info"
                title="Before You Write"
                className="mb-8"
              />

              <div className="space-y-6">
                <div className="flex gap-4 border-b border-charcoal/5 pb-6">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-medium text-charcoal">Our Location</h4>
                    <p className="mt-1 text-sm text-muted">{SITE_ADDRESS}</p>
                    <p className="text-sm text-muted">{SITE_CITY}</p>
                  </div>
                </div>

                <div className="flex gap-4 border-b border-charcoal/5 pb-6">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-medium text-charcoal">Business Hours</h4>
                    <p className="mt-1 text-sm text-muted">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                    <p className="text-sm text-muted">Sunday: 2:00 PM – 6:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 border-b border-charcoal/5 pb-6">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-medium text-charcoal">Delivery</h4>
                    <p className="mt-1 text-sm text-muted">
                      Nationwide shipping across Pakistan. Free delivery on orders above Rs. 3,000.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="mb-4 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
                  Common Questions
                </h4>
                <div className="space-y-4">
                  {faqs.map(({ q, a }) => (
                    <div key={q} className="border-l-2 border-gold/30 pl-4">
                      <p className="text-sm font-medium text-charcoal">{q}</p>
                      <p className="mt-1 text-sm text-muted">{a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-8 text-sm text-muted">
                Looking to shop instead?{" "}
                <Link href="/shop" className="text-gold-dark underline-offset-2 hover:underline">
                  Browse our collection
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
