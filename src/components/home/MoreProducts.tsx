import Link from "next/link";
import {
  getBestSellerProducts,
  getActivePromotions,
  getOtherProducts,
} from "@/lib/db";
import ProductGrid from "@/components/products/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";

export default async function MoreProducts() {
  const bestSellers = await getBestSellerProducts(4);
  const [products, promotions] = await Promise.all([
    getOtherProducts(
      bestSellers.map((product) => product.id),
      4
    ),
    getActivePromotions(),
  ]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Discover More"
            title="More Fragrances"
            description="Explore more scents from our collection beyond our best sellers."
            className="mb-0"
          />
          <Link href="/shop" className="btn-outline group shrink-0">
            Shop All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ProductGrid products={products} promotions={promotions} />
      </div>
    </section>
  );
}
