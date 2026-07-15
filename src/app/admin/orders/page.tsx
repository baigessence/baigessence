import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import AdminOrdersManager from "@/components/admin/AdminOrdersManager";

export default async function AdminOrdersPage() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const orders = await getOrders();

  return <AdminOrdersManager initialOrders={orders} />;
}
