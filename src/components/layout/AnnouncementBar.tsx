import Link from "next/link";
import { Sparkles, Truck, RotateCcw, Shield, Gem } from "lucide-react";

const announcements = [
  "Free Shipping on Orders Above Rs. 3,000",
  "15 Days Hassle-Free Returns",
  "Premium Long-Lasting Fragrances",
  "Crafted with Love in Pakistan",
];

export default function AnnouncementBar() {
  const doubled = [...announcements, ...announcements];

  return (
    <div className="relative overflow-hidden bg-charcoal py-2.5 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
      <div className="relative flex animate-marquee whitespace-nowrap">
        {doubled.map((text, i) => (
          <span key={i} className="mx-10 flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase">
            <Sparkles className="h-3 w-3 text-gold" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: Truck, text: "Free Delivery", sub: "Orders Rs. 3000+" },
    { icon: RotateCcw, text: "Easy Returns", sub: "15 Day Policy" },
    { icon: Shield, text: "100% Authentic", sub: "Guaranteed" },
    { icon: Gem, text: "Premium Quality", sub: "Long Lasting" },
  ];

  return (
    <div className="border-y border-charcoal/5 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-charcoal/5 md:grid-cols-4">
        {badges.map(({ icon: Icon, text, sub }) => (
          <div
            key={text}
            className="flex flex-col items-center bg-white px-4 py-8 text-center transition-colors hover:bg-cream/50"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <Icon className="h-5 w-5 text-gold-dark" />
            </div>
            <span className="text-sm font-medium tracking-wide text-charcoal">{text}</span>
            <span className="mt-0.5 text-[10px] tracking-wider text-muted uppercase">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex flex-col items-center ${className}`}>
      <span className="font-serif text-2xl font-light tracking-[0.25em] text-charcoal transition-colors duration-300 group-hover:text-gold md:text-[1.75rem]">
        BAIG
      </span>
      <span className="-mt-0.5 flex items-center gap-2 text-[9px] tracking-[0.45em] text-gold uppercase md:text-[10px]">
        <span className="h-px w-3 bg-gold/50 transition-all group-hover:w-5" />
        Essence
        <span className="h-px w-3 bg-gold/50 transition-all group-hover:w-5" />
      </span>
    </Link>
  );
}
