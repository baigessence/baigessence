import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { homeImages } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden sm:min-h-[92vh]">
      <div className="hero-image-wrap absolute inset-0">
        <Image
          src={homeImages.hero}
          alt="BaigEssence luxury fragrances"
          fill
          priority
          className="animate-ken-burns object-cover"
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[92vh] sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <div className="animate-fade-in-up flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <p className="text-[11px] tracking-[0.4em] text-gold uppercase">
              Baig Essence
            </p>
          </div>

          <h1 className="animate-fade-in-up mt-6 font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Discover Your
            <span className="mt-2 block text-gold-gradient">Signature Scent</span>
          </h1>

          <p className="animate-fade-in-up mt-6 max-w-lg text-base leading-relaxed text-gray-300/90 md:text-xl">
            Long-lasting, luxurious fragrances crafted for those who dare to leave
            a lasting impression.
          </p>

          <div className="animate-fade-in-up mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link href="/shop" className="btn-gold group">
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/shop/female" className="btn-ghost-light">
              For Her
            </Link>
            <Link
              href="/shop/male"
              className="btn-ghost-light hidden sm:inline-flex"
            >
              For Him
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
