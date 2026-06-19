import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { homeImages } from "@/lib/images";

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "12hr+", label: "Long Lasting" },
  { value: "100%", label: "Authentic" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
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

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-24 lg:px-8">
        <div className="max-w-2xl">
          <div className="animate-fade-in-up flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <p className="text-[11px] tracking-[0.4em] text-gold uppercase">
              Premium Fragrances · Pakistan
            </p>
          </div>

          <h1 className="animate-fade-in-up mt-6 font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Discover Your
            <span className="mt-2 block text-gold-gradient">Signature Scent</span>
          </h1>

          <p className="animate-fade-in-up mt-6 max-w-lg text-lg leading-relaxed text-gray-300/90 md:text-xl">
            Long-lasting, luxurious fragrances crafted for those who dare to leave
            a lasting impression.
          </p>

          <div className="animate-fade-in-up mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-gold group">
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/shop/female" className="btn-ghost-light">
              For Her
            </Link>
            <Link href="/shop/male" className="btn-ghost-light hidden sm:inline-flex">
              For Him
            </Link>
          </div>
        </div>

        <div className="animate-fade-in mt-auto grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-2xl text-gold md:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] tracking-widest text-gray-400 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
          <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
