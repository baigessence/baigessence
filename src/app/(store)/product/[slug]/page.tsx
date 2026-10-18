import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, RotateCcw } from "lucide-react";
import {
  getProductBySlug,
  getProducts,
  getPromotionForProduct,
  getRelatedProducts,
} from "@/lib/db";
import {
  formatPrice,
  getDiscountedPrice,
  getCategoryLabel,
} from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";
import ProductGallery from "@/components/products/ProductGallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [promotion, related] = await Promise.all([
    getPromotionForProduct(product.id),
    getRelatedProducts(product.category, product.id, 4),
  ]);

  const { price, originalPrice, hasDiscount } = getDiscountedPrice(
    product,
    promotion
  );

  const galleryImages = Array.from(
    new Set(
      [product.image, ...(product.images ?? [])].filter(Boolean) as string[]
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
      <nav className="mb-6 text-xs text-muted sm:mb-8 sm:text-sm">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-gold">
          {getCategoryLabel(product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          name={product.name}
          images={galleryImages}
          badge={hasDiscount ? promotion?.badge : null}
        />

        <div>
          <p className="text-xs tracking-[0.3em] text-gold uppercase sm:text-sm">
            {getCategoryLabel(product.category)}
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">
            {product.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-medium">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-sm text-muted">
              {product.size} · {product.concentration}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
            {product.description}
          </p>

          <div className="mt-6 border border-charcoal/10 p-4 sm:mt-8 sm:p-6">
            <h3 className="text-xs font-medium tracking-widest uppercase sm:text-sm">
              Fragrance Notes
            </h3>
            <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4">
              <div>
                <p className="text-[10px] tracking-wider text-gold uppercase">
                  Top
                </p>
                <p className="mt-1 text-sm">{product.notes.top}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-gold uppercase">
                  Heart
                </p>
                <p className="mt-1 text-sm">{product.notes.heart}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-gold uppercase">
                  Base
                </p>
                <p className="mt-1 text-sm">{product.notes.base}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            {product.inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <button
                disabled
                className="btn-primary w-full cursor-not-allowed opacity-50"
              >
                Sold Out
              </button>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted sm:mt-6 sm:gap-4 sm:text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-gold" />
              Free shipping Rs. 4000+
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0 text-gold" />
              15 day returns
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14 sm:mt-20">
          <h2 className="mb-6 text-center font-serif text-2xl sm:mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} promotion={null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
