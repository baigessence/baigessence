import type { PolicyDocument } from "./types";

export const refundPolicy: PolicyDocument = {
  slug: "refund-policy",
  title: "Refund & Exchange Policy",
  metaDescription:
    "Understand Baig Essence refund and exchange eligibility, timelines, and how to request a return.",
  lastUpdated: "June 2026",
  intro:
    "At Baig Essence, we are committed to providing premium-quality fragrances and ensuring your satisfaction. If you are not completely happy with your purchase, please review our Refund & Exchange Policy below.",
  sections: [
    {
      id: "customer-satisfaction",
      title: "Customer Satisfaction",
      paragraphs: [
        "We accept return or exchange requests for any product that does not meet your expectations.",
      ],
    },
    {
      id: "return-window",
      title: "7-Day Return Window",
      paragraphs: [
        "Return or exchange requests must be submitted within 7 days from the date your order is delivered.",
      ],
    },
    {
      id: "product-condition",
      title: "Product Condition",
      paragraphs: [
        "To qualify for a refund or exchange, the perfume bottle must contain at least 90% of its original contents and should be returned in its original packaging whenever possible.",
      ],
    },
    {
      id: "processing-time",
      title: "Processing Time",
      paragraphs: [
        "Approved refund or exchange requests are processed within 3–5 working days after the returned product has been received and inspected.",
      ],
    },
    {
      id: "delivery-charges",
      title: "Delivery Charges",
      paragraphs: [
        "Original delivery charges are non-refundable. Customers are responsible for the delivery charges associated with exchange orders.",
      ],
    },
    {
      id: "tester-box",
      title: "Tester Box (Sample Box)",
      paragraphs: [
        "Tester Boxes or Sample Boxes are not eligible for refunds or exchanges, as they are intended solely for fragrance testing.",
      ],
    },
    {
      id: "orders-above-10000",
      title: "Orders Above Rs. 10,000",
      paragraphs: [
        "Orders with a total value exceeding Rs. 10,000 are not eligible for refunds. However, they may be exchanged in accordance with this policy.",
      ],
    },
    {
      id: "damaged-or-incorrect-products",
      title: "Damaged, Leaking, or Incorrect Products",
      paragraphs: [
        "If you receive a damaged, leaking, or incorrect product, Baig Essence will bear all return and replacement delivery charges. Please report the issue within 48 hours of delivery and provide clear photographs for verification.",
      ],
    },
    {
      id: "refund-method",
      title: "Refund Method",
      paragraphs: [
        "Once your return is approved, the refund will be processed using the original payment method whenever possible. For Cash on Delivery (COD) orders, refunds will be issued through bank transfer or another mutually agreed payment method.",
      ],
    },
    {
      id: "need-assistance",
      title: "Need Assistance?",
      paragraphs: [
        "If you have any questions or wish to request a refund or exchange, please contact our customer support team with your Order Number, Full Name, Reason for the Request, and any relevant photos (if applicable). We will be happy to assist you.",
        "Baig Essence",
        "Email: baigessence@gmail.com",
        "Phone: +92-3226053521",
      ],
    },
  ],
};
