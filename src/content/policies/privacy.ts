import type { PolicyDocument } from "./types";

export const privacyPolicy: PolicyDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  metaDescription:
    "Learn how Baig Essence collects, uses, and protects your personal information when you shop with us.",
  lastUpdated: "June 2026",
  intro:
    'At Baig Essence ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place an order, or interact with our services. By using our website, you agree to the practices described in this Privacy Policy.',
  sections: [
    {
      id: "personal-information",
      title: "Personal Information",
      paragraphs: [
        "When you place an order, create an account, or contact us, we may collect:",
      ],
      listItems: [
        "Full name",
        "Email address",
        "Phone number",
        "Billing address",
        "Shipping address",
        "Payment information (processed securely through our payment providers)",
        "Order history",
        "Any information you voluntarily provide through forms or customer support",
      ],
    },
    {
      id: "automatically-collected-information",
      title: "Automatically Collected Information",
      paragraphs: ["When you browse our website, we may automatically collect:"],
      listItems: [
        "IP address",
        "Browser type and version",
        "Device information",
        "Time zone",
        "Pages viewed",
        "Date and time of your visit",
        "Referring website",
        "Website usage and browsing behavior",
      ],
      afterList: [
        "This information helps us improve our website and customer experience.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      paragraphs: ["Our website uses cookies and similar technologies to:"],
      listItems: [
        "Remember your preferences",
        "Improve website performance",
        "Analyze visitor behavior",
        "Provide a better shopping experience",
      ],
      afterList: [
        "You can disable cookies through your browser settings; however, some features of our website may not function properly.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      paragraphs: ["We use your information to:"],
      listItems: [
        "Process and fulfill your orders",
        "Deliver products to your address",
        "Process payments securely",
        "Send order confirmations and shipping updates",
        "Respond to customer inquiries",
        "Improve our products and website",
        "Prevent fraud and unauthorized transactions",
        "Send promotional offers, newsletters, or marketing communications (only where permitted)",
      ],
      afterList: ["You may unsubscribe from promotional emails at any time."],
    },
    {
      id: "sharing-information",
      title: "Sharing Your Information",
      paragraphs: [
        "We do not sell or rent your personal information.",
        "We may share your information with trusted third parties only when necessary, including:",
      ],
      listItems: [
        "Payment processors",
        "Shipping and courier companies",
        "Website hosting providers",
        "Analytics providers",
        "Marketing service providers",
      ],
      afterList: [
        "These partners receive only the information necessary to perform their services and are required to protect your data.",
        "We may also disclose information if required by law or to protect our legal rights.",
      ],
    },
    {
      id: "payment-security",
      title: "Payment Security",
      paragraphs: [
        "Payments made through our website are processed using secure payment gateways. Baig Essence does not store your complete debit or credit card details on our servers.",
      ],
    },
    {
      id: "marketing-communications",
      title: "Marketing Communications",
      paragraphs: [
        "With your permission, we may send promotional emails, product updates, discounts, and special offers.",
        "You may unsubscribe at any time by clicking the unsubscribe link in our emails or contacting us directly.",
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      paragraphs: [
        "We retain your personal information only for as long as necessary to:",
      ],
      listItems: [
        "Complete your orders",
        "Provide customer support",
        "Maintain business records",
        "Comply with legal and tax obligations",
      ],
      afterList: [
        "After that period, your information will be securely deleted or anonymized where appropriate.",
      ],
    },
    {
      id: "your-privacy-rights",
      title: "Your Privacy Rights",
      paragraphs: ["Depending on applicable laws, you may have the right to:"],
      listItems: [
        "Access your personal information",
        "Correct inaccurate information",
        "Request deletion of your data",
        "Object to certain processing activities",
        "Withdraw consent for marketing communications",
      ],
      afterList: [
        "To exercise these rights, please contact us using the details below.",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      paragraphs: [
        "We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, misuse, alteration, or disclosure.",
        "While we strive to protect your data, no internet transmission or electronic storage method is completely secure.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      paragraphs: [
        "Our website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children.",
        "If we become aware that such information has been collected, we will promptly delete it.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      paragraphs: [
        "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites and encourage you to review their privacy policies.",
      ],
    },
    {
      id: "changes-to-policy",
      title: "Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our business practices, legal requirements, or operational needs.",
        'Any updates will be posted on this page with the revised "Last Updated" date.',
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      paragraphs: [
        "If you have any questions about this Privacy Policy or how your information is handled, please contact us:",
        "Baig Essence",
        "Email: baigessence@gmail.com",
        "Phone: +92-3226053521",
        "Website: https://www.baigessence.com",
      ],
    },
  ],
};
