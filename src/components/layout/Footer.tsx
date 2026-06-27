import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./AnnouncementBar";
import SocialLinks from "./SocialLinks";
import { policyLinks } from "@/content/policies";
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_PHONE_DISPLAY,
} from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="mt-auto bg-charcoal text-white">
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center lg:px-8">
          <Logo className="[&_span]:text-white [&_span:last-child]:text-gold" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
            Premium long-lasting fragrances for those who appreciate the art of scent.
          </p>
          <SocialLinks className="mt-6 justify-center" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/shop/male" className="transition-colors hover:text-gold">For Him</Link></li>
              <li><Link href="/shop/female" className="transition-colors hover:text-gold">For Her</Link></li>
              <li><Link href="/shop/unisex" className="transition-colors hover:text-gold">Unisex</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-gold">All Fragrances</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="transition-colors hover:text-gold">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-gold">Contact Us</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-gold">Shop All</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a
                  href={`tel:${SITE_PHONE}`}
                  className="flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  {SITE_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  {SITE_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{SITE_ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/5 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Baig Essence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
