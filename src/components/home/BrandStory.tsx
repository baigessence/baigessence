import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { homeImages } from "@/lib/images";

export default function BrandStory() {
  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={homeImages.brandStory}
                alt="BaigEssence craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -right-6 -bottom-6 hidden h-48 w-48 border-2 border-gold/40 lg:block" />
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-gold/10" />
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="Crafted, Not Copied"
              description="Every BaigEssence fragrance is a story — personal, powerful, and unlike anything else. We blend premium ingredients to create scents that linger from morning to midnight."
            />
            <blockquote className="border-l-2 border-gold pl-6 font-serif text-xl leading-relaxed text-charcoal italic md:text-2xl">
              &ldquo;Built with bold blends and clean ingredients that truly last.
              Your signature scent deserves nothing less.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              From intimate evenings to confident daily wear, our collection is designed
              for the modern fragrance lover who values quality, longevity, and elegance
              at accessible prices.
            </p>
            <Link href="/shop" className="btn-outline mt-8 group inline-flex">
              Explore Fragrances
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
