import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getPromotions, getProducts } from "@/lib/db";
import PromotionManager from "@/components/admin/PromotionManager";

export default async function AdminPromotionsPage() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const [promotions, products] = await Promise.all([
    getPromotions(),
    getProducts(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl">Promotions</h1>
      <p className="mt-1 text-muted">
        Create and manage sales, discounts, and promotional offers
      </p>
      <div className="mt-8">
        <PromotionManager promotions={promotions} products={products} />
      </div>
    </div>
  );
}
