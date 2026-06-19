import Link from "next/link";
import { getFeaturedProducts, getActivePromotions } from "@/lib/db";
import ProductGrid from "@/components/products/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProducts() {
  const [products, promotions] = await Promise.all([
    getFeaturedProducts(),
    getActivePromotions(),
  ]);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
        <SectionHeading
            align="left"
            eyebrow="Curated Selection"
            title="Best Sellers"
            description="Our most loved fragrances, chosen by customers across Pakistan."
            className="mb-0"
          />
          <Link href="/shop" className="btn-outline group shrink-0">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ProductGrid products={products} promotions={promotions} />
      </div>
    </section>
  );
}
