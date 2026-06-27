import type { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";
import { termsAndConditions } from "@/content/policies";

export const metadata: Metadata = {
  title: termsAndConditions.title,
  description: termsAndConditions.metaDescription,
};

export default function TermsAndConditionsPage() {
  return <PolicyPage policy={termsAndConditions} />;
}
