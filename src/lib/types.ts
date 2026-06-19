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
