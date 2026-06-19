import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductsByCategory, getActivePromotions } from "@/lib/db";
import { getCategoryLabel } from "@/lib/utils";
import ProductGrid from "@/components/products/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";

const validCategories = ["male", "female", "unisex"] as const;

type Category = (typeof validCategories)[number];

const categoryMeta: Record<Category, { title: string; description: string }> = {
  male: {
    title: "Perfumes for Men",
    description: "Bold, sophisticated fragrances crafted for the modern gentleman.",
  },
  female: {
    title: "Perfumes for Women",
    description: "Elegant and enchanting scents that capture feminine grace.",
  },
  unisex: {
    title: "Unisex Fragrances",
    description: "Timeless scents that transcend gender boundaries.",
  },
};

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) {
    return { title: "Not Found" };
  }
  const meta = categoryMeta[category as Category];
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CategoryShopPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) {
    notFound();
  }

  const sortParams = await searchParams;
  let products = await getProductsByCategory(category);
  const promotions = await getActivePromotions();

  if (sortParams.sort === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortParams.sort === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortParams.sort === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  const meta = categoryMeta[category as Category];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm tracking-[0.3em] text-gold uppercase">
          {getCategoryLabel(category)}
        </p>
        <h1 className="mt-2 font-serif text-4xl">{meta.title}</h1>
        <p className="mt-2 text-muted">{meta.description}</p>
        <p className="mt-1 text-sm text-muted">{products.length} products</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense fallback={<div className="w-56 shimmer h-40 rounded" />}>
          <ShopFilters currentCategory={category} />
        </Suspense>
        <div className="flex-1">
          <ProductGrid products={products} promotions={promotions} />
        </div>
      </div>
    </div>
  );
}
