import type { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";
import { refundPolicy } from "@/content/policies";

export const metadata: Metadata = {
  title: refundPolicy.title,
  description: refundPolicy.metaDescription,
};

export default function RefundPolicyPage() {
  return <PolicyPage policy={refundPolicy} />;
}
