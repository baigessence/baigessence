import type { Product, Promotion } from "@/lib/types";
import ProductCard from "./ProductCard";
import { getPromotionForProduct } from "@/lib/db";

type ProductGridProps = {
  products: Product[];
  promotions?: Promotion[];
};

export default async function ProductGrid({ products, promotions }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-muted">No fragrances found</p>
        <p className="mt-2 text-sm text-muted">Check back soon for new arrivals</p>
      </div>
    );
  }

  const promotionMap = new Map<string, Promotion>();
  if (promotions) {
    for (const promo of promotions) {
      for (const pid of promo.productIds) {
        promotionMap.set(pid, promo);
      }
    }
  } else {
    for (const product of products) {
      const promo = await getPromotionForProduct(product.id);
      if (promo) promotionMap.set(product.id, promo);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          promotion={promotionMap.get(product.id)}
        />
      ))}
    </div>
  );
}
