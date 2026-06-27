import type { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";
import { shippingPolicy } from "@/content/policies";

export const metadata: Metadata = {
  title: shippingPolicy.title,
  description: shippingPolicy.metaDescription,
};

export default function ShippingPolicyPage() {
  return <PolicyPage policy={shippingPolicy} />;
}
