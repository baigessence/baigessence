export type Category = "male" | "female" | "unisex";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  notes: { top: string; heart: string; base: string };
  size: string;
  concentration: string;
  inStock: boolean;
  featured: boolean;
  promotionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Promotion = {
  id: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  productIds: string[];
  startDate: string;
  endDate: string;
  active: boolean;
  badge?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
};

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type OrderFulfillmentStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNote?: string;
  safepayTracker?: string;
  createdAt: string;
  updatedAt: string;
};
