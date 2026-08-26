import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getPromoCodes } from "@/lib/db";
import PromoCodeManager from "@/components/admin/PromoCodeManager";

export default async function AdminPromoCodesPage() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const promoCodes = await getPromoCodes();

  return <PromoCodeManager promoCodes={promoCodes} />;
}
