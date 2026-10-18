"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import type { Product, Promotion } from "@/lib/types";
import { formatPrice, getDiscountedPrice, getCategoryLabel } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";

type ProductCardProps = {
  product: Product;
  promotion?: Promotion | null;
};

export default function ProductCard({ product, promotion }: ProductCardProps) {
  const { addItem } = useCart();
  const { price, originalPrice, hasDiscount } = getDiscountedPrice(
    product,
    promotion
  );
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const href = `/product/${product.slug}`;

  return (
    <article className="group card-luxury product-glow relative overflow-hidden">
      {/* Whole card opens product detail */}
      <Link
        href={href}
        prefetch
        className="absolute inset-0 z-[1]"
        aria-label={`View ${product.name}`}
      />

      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/10" />

        <div className="pointer-events-none absolute top-3 left-3 z-[2] flex flex-col gap-2">
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

        {/* Desktop: quick add sits above the card link */}
        {product.inStock && (
          <div className="absolute inset-x-0 bottom-0 z-[2] hidden translate-y-full items-center justify-center bg-gradient-to-t from-black/80 to-transparent p-5 transition-transform duration-500 group-hover:translate-y-0 md:flex">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
              }}
              className="relative z-[2] flex h-11 items-center gap-2 bg-gold px-5 text-xs font-semibold tracking-widest text-charcoal uppercase transition-all hover:scale-105 hover:bg-white"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        )}
      </div>

      <div className="relative p-4 sm:p-5">
        <p className="pointer-events-none text-[10px] tracking-[0.25em] text-gold uppercase">
          {getCategoryLabel(product.category)}
        </p>
        <h3 className="pointer-events-none mt-1.5 font-serif text-base leading-snug transition-colors duration-300 group-hover:text-gold sm:text-xl">
          {product.name}
        </h3>
        <div className="pointer-events-none mt-2 flex flex-wrap items-baseline gap-2 sm:mt-3">
          <span className="text-sm font-medium sm:text-lg">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through sm:text-sm">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="w-full text-[10px] tracking-wider text-muted/80 uppercase sm:w-auto">
            {product.size}
          </span>
        </div>

        {product.inStock ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="relative z-[2] mt-3 flex w-full items-center justify-center gap-1.5 bg-charcoal px-3 py-2.5 text-[10px] font-semibold tracking-widest text-white uppercase transition-colors hover:bg-gold hover:text-charcoal md:hidden"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        ) : (
          <p className="pointer-events-none mt-3 text-center text-[10px] tracking-wider text-muted uppercase md:hidden">
            Sold out
          </p>
        )}
      </div>
    </article>
  );
}
