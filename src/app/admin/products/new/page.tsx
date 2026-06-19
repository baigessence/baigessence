import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  return (
    <div>
      <h1 className="font-serif text-3xl">Add New Product</h1>
      <p className="mt-1 text-muted">Create a new fragrance listing</p>
      <div className="mt-8 rounded-xl border bg-white p-6">
        <ProductForm />
      </div>
    </div>
  );
}
