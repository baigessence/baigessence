import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdminSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdmin ? (
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
