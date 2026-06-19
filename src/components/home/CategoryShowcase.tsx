import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { homeImages } from "@/lib/images";

const categories = [
  {
    slug: "male",
    title: "For Him",
    subtitle: "Bold & Sophisticated",
    image: homeImages.categoryMale,
    description: "Masculine fragrances with depth and character",
  },
  {
    slug: "female",
    title: "For Her",
    subtitle: "Elegant & Enchanting",
    image: homeImages.categoryFemale,
    description: "Feminine scents that captivate and inspire",
  },
  {
    slug: "unisex",
    title: "Unisex",
    subtitle: "Timeless & Universal",
    image: homeImages.categoryUnisex,
    description: "Fragrances that transcend boundaries",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Collections"
          title="Shop by Category"
          description="Find the perfect fragrance for every mood, moment, and personality."
          className="mb-12 md:mb-16"
        />

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />
              <div className="absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-gold/30" />

              <div className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5 text-white" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="text-[10px] tracking-[0.35em] text-gold uppercase">
                  {cat.subtitle}
                </p>
                <h3 className="mt-2 font-serif text-3xl transition-colors duration-300 group-hover:text-gold md:text-4xl">
                  {cat.title}
                </h3>
                <p className="mt-3 max-h-0 overflow-hidden text-sm text-gray-300 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-gold uppercase opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Explore
                  <span className="h-px w-6 bg-gold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
