import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./AnnouncementBar";

export default function Footer() {
  return (
    <footer className="mt-auto bg-charcoal text-white">
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center lg:px-8">
          <Logo className="[&_span]:text-white [&_span:last-child]:text-gold" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
            Premium long-lasting fragrances for those who appreciate the art of scent.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
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
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/contact" className="transition-colors hover:text-gold">Contact Us</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gold">Shipping & Delivery</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gold">Returns & Exchanges</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gold">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                +92 300 1234567
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                hello@baigessence.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Karachi, Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} BaigEssence. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-gold">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
