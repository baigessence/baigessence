export type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
  afterList?: string[];
};

export type PolicyDocument = {
  slug: string;
  title: string;
  metaDescription: string;
  lastUpdated: string;
  intro: string;
  sections: PolicySection[];
};

export const policyLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Exchange Policy" },
  { href: "/shipping-policy", label: "Shipping & Delivery Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
] as const;
