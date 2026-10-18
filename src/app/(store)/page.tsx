import { Suspense } from "react";
import { TrustBadges } from "@/components/layout/AnnouncementBar";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import MoreProducts from "@/components/home/MoreProducts";
import Testimonials from "@/components/home/Testimonials";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import { getActivePromotions } from "@/lib/db";

function ProductSectionFallback() {
  return (
    <div className="section-padding mx-auto max-w-7xl animate-pulse px-4 lg:px-8">
      <div className="mb-10 h-8 w-48 rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded bg-cream" />
        ))}
      </div>
    </div>
  );
}

async function HomePromoBanner() {
  const promotions = await getActivePromotions();
  return <PromoBanner promotions={promotions} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryShowcase />
      <Suspense fallback={<ProductSectionFallback />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<ProductSectionFallback />}>
        <MoreProducts />
      </Suspense>
      <BrandStory />
      <Suspense fallback={null}>
        <HomePromoBanner />
      </Suspense>
      <Testimonials />
      <Newsletter />
    </>
  );
}
