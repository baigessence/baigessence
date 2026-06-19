import { TrustBadges } from "@/components/layout/AnnouncementBar";
import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import PromoBanner from "@/components/home/PromoBanner";
import Newsletter from "@/components/home/Newsletter";
import { getActivePromotions } from "@/lib/db";

export default async function HomePage() {
  const promotions = await getActivePromotions();

  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryShowcase />
      <FeaturedProducts />
      <BrandStory />
      <PromoBanner promotions={promotions} />
      <Testimonials />
      <Newsletter />
    </>
  );
}
