import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BaigEssence | Premium Long-Lasting Perfumes",
    template: "%s | BaigEssence",
  },
  description:
    "Discover premium long-lasting fragrances for men, women, and unisex. Shop luxury perfumes at affordable prices with free shipping across Pakistan.",
  keywords: ["perfume", "fragrance", "Pakistan", "luxury perfume", "BaigEssence"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
