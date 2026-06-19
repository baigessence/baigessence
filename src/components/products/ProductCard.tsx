"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import type { Product, Promotion } from "@/lib/types";
import { formatPrice, getDiscountedPrice, getCategoryLabel } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";

type ProductCardProps = {
  product: Product;
  promotion?: Promotion | null;
};

export default function ProductCard({ product, promotion }: ProductCardProps) {
  const { addItem } = useCart();
  const { price, originalPrice, hasDiscount } = getDiscountedPrice(product, promotion);
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <article className="group card-luxury product-glow overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/10" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-charcoal/90 px-2.5 py-1 text-[9px] font-bold tracking-widest text-gold uppercase backdrop-blur-sm">
              Best Seller
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gold px-2.5 py-1 text-[9px] font-bold tracking-widest text-charcoal uppercase">
              {promotion?.badge || `${discountPercent}% Off`}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-charcoal px-2.5 py-1 text-[9px] font-bold tracking-widest text-white uppercase">
              Sold Out
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-5 transition-transform duration-500 group-hover:translate-y-0">
          <Link
            href={`/product/${product.slug}`}
            className="flex h-11 w-11 items-center justify-center bg-white text-charcoal transition-all hover:bg-gold hover:scale-105"
            aria-label="View product"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {product.inStock && (
            <button
              onClick={() => addItem(product)}
              className="flex h-11 items-center gap-2 bg-gold px-5 text-xs font-semibold tracking-widest text-charcoal uppercase transition-all hover:bg-white hover:scale-105"
              aria-label="Add to cart"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-[10px] tracking-[0.25em] text-gold uppercase">
          {getCategoryLabel(product.category)}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1.5 font-serif text-xl transition-colors duration-300 group-hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-1 text-xs text-muted">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-medium">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[10px] tracking-wider text-muted/80 uppercase">
          {product.size} · {product.concentration}
        </p>
      </div>
    </article>
  );
}
