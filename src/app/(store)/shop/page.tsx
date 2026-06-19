import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getActivePromotions } from "@/lib/db";
import ProductGrid from "@/components/products/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description: "Browse our complete collection of premium perfumes for men, women, and unisex.",
};

type SearchParams = Promise<{ q?: string; sort?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let products = await getProducts();
  const promotions = await getActivePromotions();

  if (params.q) {
    const query = params.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query)
    );
  }

  if (params.sort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (params.sort === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm tracking-[0.3em] text-gold uppercase">Our Collection</p>
        <h1 className="mt-2 font-serif text-4xl">All Fragrances</h1>
        <p className="mt-2 text-muted">{products.length} products</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense fallback={<div className="w-56 shimmer h-40 rounded" />}>
          <ShopFilters currentCategory="all" />
        </Suspense>
        <div className="flex-1">
          <ProductGrid products={products} promotions={promotions} />
        </div>
      </div>
    </div>
  );
}
