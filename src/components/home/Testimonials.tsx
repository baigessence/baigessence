import { Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const reviews = [
  {
    name: "Ayesha K.",
    location: "Karachi",
    text: "The fragrances are absolutely divine. Long-lasting and the packaging feels so premium. My new go-to perfume brand!",
    rating: 5,
  },
  {
    name: "Hassan R.",
    location: "Lahore",
    text: "Best value for money I've found in Pakistan. The oud collection is incredible — gets compliments every single day.",
    rating: 5,
  },
  {
    name: "Sana M.",
    location: "Islamabad",
    text: "Fast delivery, beautiful bottles, and scents that actually last 8+ hours. BaigEssence exceeded my expectations.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-cream/60">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Happy Customers"
          title="Loved by Fragrance Enthusiasts"
          description="Join thousands across Pakistan who've found their signature scent with BaigEssence."
          className="mb-12 md:mb-16"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="card-luxury flex flex-col p-8"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-6 border-t border-charcoal/5 pt-5">
                <p className="font-medium text-charcoal">{review.name}</p>
                <p className="text-xs tracking-wider text-gold uppercase">
                  {review.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
