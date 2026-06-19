import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden md:min-h-[55vh]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 lg:px-8 lg:pb-20">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <p className="text-[11px] tracking-[0.35em] text-gold uppercase">{eyebrow}</p>
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-white md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-300 md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
