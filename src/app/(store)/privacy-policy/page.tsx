import type { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";
import { privacyPolicy } from "@/content/policies";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.metaDescription,
};

export default function PrivacyPolicyPage() {
  return <PolicyPage policy={privacyPolicy} />;
}
