import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const isAdmin = await verifyAdminSession();
  if (isAdmin) redirect("/admin");

  return <AdminLoginForm />;
}
