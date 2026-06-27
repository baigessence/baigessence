import type { PolicyDocument } from "./types";

export const shippingPolicy: PolicyDocument = {
  slug: "shipping-policy",
  title: "Shipping & Delivery Policy",
  metaDescription:
    "Baig Essence shipping rates, delivery times, order tracking, and delivery information for customers across Pakistan.",
  lastUpdated: "June 2026",
  intro:
    "At Baig Essence, we are committed to delivering your favorite fragrances safely and on time. Please read our Shipping & Delivery Policy before placing your order.",
  sections: [
    {
      id: "order-processing",
      title: "Order Processing",
      paragraphs: [],
      listItems: [
        "Orders are processed within 1–2 working days after order confirmation.",
        "Orders placed on weekends or public holidays will be processed on the next working day.",
        "During sales, promotional campaigns, or holidays, processing times may be slightly longer.",
      ],
    },
    {
      id: "delivery-time",
      title: "Delivery Time",
      paragraphs: ["Estimated delivery times are:"],
      listItems: [
        "Major Cities in Pakistan: 2–4 working days",
        "Other Cities & Remote Areas: 3–7 working days",
      ],
      afterList: [
        "Delivery times are estimates and may vary due to weather conditions, courier delays, public holidays, or other unforeseen circumstances.",
      ],
    },
    {
      id: "shipping-charges",
      title: "Shipping Charges",
      paragraphs: [],
      listItems: [
        "Shipping charges are calculated at checkout based on your delivery location and order value.",
        "Any promotional offers for free shipping will be displayed on our website when applicable.",
      ],
    },
    {
      id: "order-tracking",
      title: "Order Tracking",
      paragraphs: [
        "Once your order has been shipped, you will receive a tracking number via SMS, email, or WhatsApp (where available) so you can monitor your shipment.",
      ],
    },
    {
      id: "delivery-attempts",
      title: "Delivery Attempts",
      paragraphs: [
        "Our courier partner will make reasonable delivery attempts. If the delivery cannot be completed due to an incorrect address, unavailable recipient, or refusal to accept the parcel, the order may be returned to us. Additional shipping charges may apply for re-delivery.",
      ],
    },
    {
      id: "incorrect-shipping-information",
      title: "Incorrect Shipping Information",
      paragraphs: [
        "Customers are responsible for providing accurate shipping details. Baig Essence is not responsible for delays or failed deliveries resulting from incorrect or incomplete address information.",
      ],
    },
    {
      id: "damaged-or-incorrect-orders",
      title: "Damaged or Incorrect Orders",
      paragraphs: [
        "If your order arrives damaged, leaking, or you receive the wrong product, please contact us within 48 hours of delivery with clear photographs of the package and product. After verification, we will arrange a replacement at no additional cost.",
      ],
    },
    {
      id: "cash-on-delivery",
      title: "Cash on Delivery (COD)",
      paragraphs: [
        "Baig Essence offers Cash on Delivery (COD) and other secure payment methods where available. Customers are requested to ensure someone is available at the delivery address to receive and pay for the order.",
      ],
    },
    {
      id: "international-shipping",
      title: "International Shipping",
      paragraphs: [
        "Currently, Baig Essence delivers within Pakistan only. If international shipping becomes available, this policy will be updated accordingly.",
      ],
    },
    {
      id: "contact-us",
      title: "Contact Us",
      paragraphs: [
        "If you have any questions regarding shipping or delivery, please contact us:",
        "Baig Essence",
        "Email: baigessence@gmail.com",
        "Phone: +92-3226053521",
      ],
    },
  ],
};
