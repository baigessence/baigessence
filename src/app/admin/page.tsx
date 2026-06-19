import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Tag, TrendingUp, ShoppingBag } from "lucide-react";
import { verifyAdminSession } from "@/lib/auth";
import { getProducts, getPromotions } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const [products, promotions] = await Promise.all([
    getProducts(),
    getPromotions(),
  ]);

  const inStock = products.filter((p) => p.inStock).length;
  const activePromos = promotions.filter((p) => p.active).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "In Stock", value: inStock, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
    { label: "Active Promotions", value: activePromos, icon: Tag, color: "bg-gold/10 text-gold-dark" },
    { label: "Catalog Value", value: formatPrice(totalValue), icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted">Welcome to BaigEssence admin panel</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Quick Actions</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/products/new" className="btn-primary text-center text-xs">
              Add Product
            </Link>
            <Link href="/admin/promotions" className="btn-outline text-center text-xs">
              Manage Promotions
            </Link>
            <Link href="/admin/products" className="btn-outline text-center text-xs">
              View All Products
            </Link>
            <Link href="/" target="_blank" className="btn-outline text-center text-xs">
              View Storefront
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-medium">Recent Products</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-muted">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
