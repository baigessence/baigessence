import { redirect, notFound } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getProductById } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit Product</h1>
      <p className="mt-1 text-muted">{product.name}</p>
      <div className="mt-8 rounded-xl border bg-white p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
