import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FlaskConical, Heart, Sparkles, Leaf, Award } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind BaigEssence — premium long-lasting fragrances crafted with passion in Pakistan.",
};

const values = [
  {
    icon: FlaskConical,
    title: "Premium Ingredients",
    description:
      "We source the finest fragrance oils and essences to ensure every bottle delivers richness and depth.",
  },
  {
    icon: Sparkles,
    title: "Long Lasting",
    description:
      "Our EDP concentrations are formulated to stay with you from morning meetings to evening gatherings.",
  },
  {
    icon: Leaf,
    title: "Clean & Bold",
    description:
      "Bold blends with carefully balanced notes — never overpowering, always memorable.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every fragrance is crafted in small batches with attention to detail and passion for the art of scent.",
  },
];

const milestones = [
  { year: "2024", title: "The Beginning", text: "BaigEssence was born from a passion for premium fragrances at accessible prices." },
  { year: "2025", title: "First Collection", text: "Launched our signature For Him, For Her, and Unisex lines across Pakistan." },
  { year: "2026", title: "Growing Family", text: "Serving hundreds of happy customers with fast delivery nationwide." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="The Art of BaigEssence"
        description="Where passion meets perfumery. We create fragrances that tell your story."
        image={aboutImages.hero}
        imageAlt="BaigEssence about us"
      />

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={aboutImages.mission}
                  alt="BaigEssence perfumes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -right-4 -bottom-4 border border-gold/30 bg-white p-6 shadow-xl md:-right-8 md:-bottom-8 md:p-8">
                <Award className="h-8 w-8 text-gold" />
                <p className="mt-3 font-serif text-2xl text-charcoal">100%</p>
                <p className="text-[10px] tracking-widest text-muted uppercase">Authentic Fragrances</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionHeading
                align="left"
                eyebrow="Who We Are"
                title="Fragrances That Leave a Lasting Impression"
                description="BaigEssence was founded with one belief: everyone deserves access to premium, long-lasting fragrances without the luxury markup."
                className="mb-8"
              />
              <p className="leading-relaxed text-muted">
                Based in Karachi, Pakistan, we craft each scent with the modern wearer in mind —
                bold enough to stand out, refined enough for everyday elegance. From woody ouds
                to delicate florals, our collection celebrates individuality.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                We don&apos;t imitate designer brands. We create original compositions inspired
                by the world&apos;s finest perfumeries, tailored for the Pakistani market with
                prices that make luxury accessible.
              </p>
              <Link href="/shop" className="btn-gold mt-8 group inline-flex">
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding relative overflow-hidden bg-cream/50">
        <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gold" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="What We Stand For"
            description="The principles that guide every bottle we create."
            className="mb-12 md:mb-16"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="card-luxury group p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-colors group-hover:border-gold/40 group-hover:bg-gold/10">
                  <Icon className="h-6 w-6 text-gold-dark" />
                </div>
                <h3 className="font-serif text-xl text-charcoal">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-charcoal text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Our Journey"
            title="Milestones"
            light
            className="mb-12 md:mb-16"
          />
          <div className="relative space-y-12 border-l border-gold/30 pl-8 md:pl-12">
            {milestones.map(({ year, title, text }) => (
              <div key={year} className="relative">
                <span className="absolute -left-[2.35rem] flex h-4 w-4 items-center justify-center rounded-full border-2 border-gold bg-charcoal md:-left-[3.35rem] md:h-5 md:w-5" />
                <p className="text-sm font-medium tracking-[0.2em] text-gold uppercase">{year}</p>
                <h3 className="mt-2 font-serif text-2xl">{title}</h3>
                <p className="mt-2 max-w-xl text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full border-2 border-gold/30">
            <Image
              src={aboutImages.founder}
              alt="Founder"
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <blockquote className="font-serif text-2xl leading-relaxed text-charcoal italic md:text-3xl">
            &ldquo;I started BaigEssence because I believed Pakistan deserved a homegrown
            fragrance brand that rivals international luxury — without the international price tag.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm tracking-[0.2em] text-gold uppercase">— Founder, BaigEssence</p>
          <Link href="/contact" className="btn-outline mt-10 inline-flex">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
