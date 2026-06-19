import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, RotateCcw } from "lucide-react";
import {
  getProductBySlug,
  getProductsByCategory,
  getPromotionForProduct,
} from "@/lib/db";
import {
  formatPrice,
  getDiscountedPrice,
  getCategoryLabel,
} from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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

  const promotion = await getPromotionForProduct(product.id);
  const { price, originalPrice, hasDiscount } = getDiscountedPrice(product, promotion);
  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category}`} className="hover:text-gold">
          {getCategoryLabel(product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-cream">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {hasDiscount && promotion?.badge && (
              <span className="absolute top-4 left-4 bg-gold px-3 py-1 text-xs font-bold tracking-wider text-charcoal uppercase">
                {promotion.badge}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-cream">
                  <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm tracking-[0.3em] text-gold uppercase">
            {getCategoryLabel(product.category)}
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-muted">{product.shortDescription}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-medium">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-muted">
            {product.size} · {product.concentration}
          </p>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          {/* Fragrance notes */}
          <div className="mt-8 border border-gray-100 p-6">
            <h3 className="text-sm font-medium tracking-widest uppercase">Fragrance Notes</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs tracking-wider text-gold uppercase">Top</p>
                <p className="mt-1 text-sm">{product.notes.top}</p>
              </div>
              <div>
                <p className="text-xs tracking-wider text-gold uppercase">Heart</p>
                <p className="mt-1 text-sm">{product.notes.heart}</p>
              </div>
              <div>
                <p className="text-xs tracking-wider text-gold uppercase">Base</p>
                <p className="mt-1 text-sm">{product.notes.base}</p>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            {product.inStock ? (
              <AddToCartButton product={product} />
            ) : (
              <button disabled className="btn-primary w-full cursor-not-allowed opacity-50">
                Sold Out
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold" />
              Free shipping Rs. 3000+
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gold" />
              15 day returns
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-center font-serif text-2xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} promotion={null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
