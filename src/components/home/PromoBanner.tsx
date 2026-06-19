import Link from "next/link";
import Image from "next/image";
import type { Promotion } from "@/lib/types";
import { Sparkles, ArrowRight } from "lucide-react";
import { homeImages } from "@/lib/images";

type PromoBannerProps = {
  promotions: Promotion[];
};

const defaultPromo = {
  name: "Summer Collection Sale",
  description: "Enjoy exclusive discounts on selected signature fragrances.",
  badge: "Limited Offer",
};

export default function PromoBanner({ promotions }: PromoBannerProps) {
  const active = promotions.filter((p) => p.active);
  const promo = active[0] ?? defaultPromo;

  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[480px]">
          <Image
            src={homeImages.promoBanner}
            alt="Sale promotion"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-charcoal/30" />
        </div>

        <div className="relative flex items-center bg-charcoal px-8 py-16 text-white lg:px-16 lg:py-20">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] tracking-[0.35em] uppercase">Limited Offer</span>
            </div>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{promo.name}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-gray-300">{promo.description}</p>
            {promo.badge && (
              <span className="mt-6 inline-block border border-gold/40 bg-gold/10 px-5 py-2 text-xs font-bold tracking-[0.2em] text-gold uppercase">
                {promo.badge}
              </span>
            )}
            <Link href="/shop" className="btn-gold mt-8 group inline-flex">
              Shop the Sale
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
