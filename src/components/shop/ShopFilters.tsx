"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { slug: "all", label: "All", href: "/shop" },
  { slug: "male", label: "For Him", href: "/shop/male" },
  { slug: "female", label: "For Her", href: "/shop/female" },
  { slug: "unisex", label: "Unisex", href: "/shop/unisex" },
];

const sortOptions = [
  { value: "", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

type ShopFiltersProps = {
  currentCategory: string;
};

export default function ShopFilters({ currentCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="mb-4 text-sm font-medium tracking-widest uppercase">Category</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className={`block py-1 text-sm transition-colors ${
                    currentCategory === cat.slug
                      ? "font-medium text-gold"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium tracking-widest uppercase">Sort By</h3>
          <select
            value={searchParams.get("sort") || ""}
            onChange={(e) => handleSort(e.target.value)}
            className="input-field w-full text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
