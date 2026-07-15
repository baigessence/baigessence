import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Tag, ShoppingBag, ClipboardList } from "lucide-react";
import { verifyAdminSession } from "@/lib/auth";
import { getOrders, getProducts, getPromotions } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const [products, promotions, orders] = await Promise.all([
    getProducts(),
    getPromotions(),
    getOrders(50),
  ]);

  const inStock = products.filter((p) => p.inStock).length;
  const activePromos = promotions.filter((p) => p.active).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    {
      label: "Orders",
      value: orders.length,
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-700",
      href: "/admin/orders",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "In Stock",
      value: inStock,
      icon: ShoppingBag,
      color: "bg-green-50 text-green-600",
      href: "/admin/products",
    },
    {
      label: "Active Promotions",
      value: activePromos,
      icon: Tag,
      color: "bg-gold/10 text-gold-dark",
      href: "/admin/promotions",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-1 text-muted">Welcome to BaigEssence admin panel</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="font-medium">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/orders"
              className="btn-primary text-center text-xs"
            >
              View Orders
            </Link>
            <Link
              href="/admin/products/new"
              className="btn-outline text-center text-xs"
            >
              Add Product
            </Link>
            <Link
              href="/admin/promotions"
              className="btn-outline text-center text-xs"
            >
              Manage Promotions
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Catalog value: {formatPrice(totalValue)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {orders.slice(0, 5).length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-charcoal/5 pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-muted">COD</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
