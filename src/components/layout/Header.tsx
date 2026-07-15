"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import AnnouncementBar, { Logo } from "./AnnouncementBar";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/shop/male", label: "For Him" },
  { href: "/shop/female", label: "For Her" },
  { href: "/shop/unisex", label: "Unisex" },
  { href: "/shop", label: "Shop All" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const leftNav = navLinks.slice(0, 3);
const rightNav = navLinks.slice(3);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const scrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const next = window.scrollY > 20;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 border-b transition-[padding,background-color,box-shadow,border-color] duration-200 ${
          scrolled
            ? "border-charcoal/5 bg-white/95 py-3 shadow-sm shadow-black/[0.04]"
            : "border-transparent bg-white/90 py-5"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 lg:gap-4 lg:px-8">
          <div className="flex min-w-0 items-center justify-start">
            <button
              className="shrink-0 rounded-full p-2 transition-colors hover:bg-cream lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-7" aria-label="Main navigation left">
              {leftNav.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 justify-center px-1 lg:px-3">
            <Logo />
          </div>

          <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
            <nav className="mr-1 hidden min-w-0 items-center gap-4 lg:flex xl:mr-2 xl:gap-7" aria-label="Main navigation right">
              {rightNav.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="shrink-0 rounded-full p-2.5 transition-colors hover:bg-cream hover:text-gold"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative shrink-0 rounded-full p-2.5 transition-colors hover:bg-cream hover:text-gold"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-charcoal">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-charcoal/5 transition-[max-height,opacity] duration-300 ${
            searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form action="/shop" method="get" className="mx-auto flex max-w-xl gap-3 px-4 py-4">
            <input
              type="search"
              name="q"
              placeholder="Search fragrances..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary shrink-0 px-6">
              Search
            </button>
          </form>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 flex h-full w-[min(320px,85vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-charcoal/5 p-5">
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 hover:bg-cream"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col overflow-y-auto p-5" aria-label="Mobile navigation">
            <p className="mb-2 text-[10px] tracking-[0.25em] text-muted uppercase">Shop</p>
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-charcoal/5 py-4 text-sm font-medium tracking-[0.12em] text-charcoal uppercase transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-6 mb-2 text-[10px] tracking-[0.25em] text-muted uppercase">Company</p>
            {navLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-charcoal/5 py-4 text-sm font-medium tracking-[0.12em] text-charcoal uppercase transition-colors hover:text-gold"
              >
                {link.label === "Contact" ? "Contact Us" : link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-charcoal/5 p-5 text-center text-[10px] tracking-widest text-muted uppercase">
            Premium Fragrances
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
