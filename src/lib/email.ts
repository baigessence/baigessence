import { Resend } from "resend";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  getWhatsAppUrl,
} from "@/lib/contact";
import {
  FULFILLMENT_DESCRIPTIONS,
  FULFILLMENT_LABELS,
} from "@/lib/order-status";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Baig Essence <onboarding@resend.dev>"
  );
}

function getAdminNotifyEmail() {
  return process.env.ORDER_NOTIFY_EMAIL?.trim() || SITE_EMAIL;
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://www.baigessence.com"
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email clients need absolute image URLs. */
function absoluteImageUrl(image: string | undefined): string | null {
  if (!image?.trim()) return null;
  const src = image.trim();
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  const siteUrl = getSiteUrl();
  return `${siteUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

function orderItemsRows(order: Order) {
  return order.items
    .map((item) => {
      const imageUrl = absoluteImageUrl(item.image);
      const imageCell = imageUrl
        ? `<td style="padding:14px 12px 14px 0;border-bottom:1px solid #ebe6dc;width:72px;vertical-align:top;">
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(item.name)}"
              width="64"
              height="80"
              style="display:block;width:64px;height:80px;object-fit:cover;border:1px solid #ebe6dc;background:#f4f0e8;"
            />
          </td>`
        : `<td style="padding:14px 12px 14px 0;border-bottom:1px solid #ebe6dc;width:72px;vertical-align:top;">
            <div style="width:64px;height:80px;background:#f4f0e8;border:1px solid #ebe6dc;"></div>
          </td>`;

      return `
      <tr>
        ${imageCell}
        <td style="padding:14px 8px 14px 0;border-bottom:1px solid #ebe6dc;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1a1a1a;vertical-align:top;">
          <span style="display:block;font-weight:600;">${escapeHtml(item.name)}</span>
          <span style="display:block;margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8276;">
            ${escapeHtml(item.size)} · Qty ${item.quantity}
          </span>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ebe6dc;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;white-space:nowrap;vertical-align:top;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`;
    })
    .join("");
}

function buildCustomerEmailHtml(order: Order) {
  const siteUrl = getSiteUrl();
  const whatsappUrl = getWhatsAppUrl(
    `Hi Baig Essence, I have a question about order ${order.orderNumber}.`
  );
  const shippingLabel =
    order.shipping === 0 ? "Free" : formatPrice(order.shipping);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Order confirmed — ${escapeHtml(order.orderNumber)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f0e8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f0e8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5dfd3;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:36px 32px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.28em;color:#ffffff;font-weight:400;">
                BAIG
              </p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.45em;color:#c9a227;text-transform:uppercase;">
                — Essence —
              </p>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;color:#b8b0a4;text-transform:uppercase;">
                Order confirmation
              </p>
            </td>
          </tr>

          <!-- Gold line -->
          <tr>
            <td style="height:3px;background:#c9a227;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1a1a1a;line-height:1.3;">
                Thank you, ${escapeHtml(order.customerName)}
              </p>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#5c564c;">
                Your Cash on Delivery order has been booked successfully.
                We&apos;ll prepare your fragrance and dispatch it shortly.
              </p>
            </td>
          </tr>

          <!-- Order meta card -->
          <tr>
            <td style="padding:20px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf8f4;border:1px solid #ebe6dc;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8276;">
                          Order number
                        </td>
                        <td style="padding:0 0 12px;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1a1a;">
                          ${escapeHtml(order.orderNumber)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8276;">
                          Payment
                        </td>
                        <td style="padding:0 0 12px;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;">
                          Cash on Delivery
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8276;">
                          Amount due
                        </td>
                        <td style="text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#c9a227;font-weight:600;">
                          ${formatPrice(order.total)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery -->
          <tr>
            <td style="padding:8px 32px 8px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c9a227;">
                Delivery address
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
                ${escapeHtml(order.shippingAddress)}<br />
                ${escapeHtml(order.shippingCity)}
              </p>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c9a227;">
                Your items
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${orderItemsRows(order)}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8a8276;">
                    Subtotal
                  </td>
                  <td style="padding:8px 0;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;">
                    ${formatPrice(order.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#8a8276;">
                    Shipping
                  </td>
                  <td style="padding:8px 0;text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;">
                    ${shippingLabel}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;border-top:1px solid #ebe6dc;"></td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1a1a1a;">
                    Total (COD)
                  </td>
                  <td style="padding:12px 0 0;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#1a1a1a;">
                    ${formatPrice(order.total)}
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#8a8276;">
                Please keep <strong style="color:#1a1a1a;">${formatPrice(order.total)}</strong> ready in cash for the courier.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 36px;text-align:center;">
              <a href="${siteUrl}/track-order?order=${encodeURIComponent(order.orderNumber)}"
                 style="display:inline-block;padding:14px 28px;background:#1a1a1a;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;margin:0 6px 10px;">
                Track your order
              </a>
              <br />
              <a href="${siteUrl}/shop"
                 style="display:inline-block;padding:12px 24px;color:#1a1a1a;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">
                Continue shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf8f4;border-top:1px solid #ebe6dc;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#5c564c;">
                Questions? Reply to this email, call
                <a href="tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}" style="color:#c9a227;text-decoration:none;">${SITE_PHONE_DISPLAY}</a>,
                or message us on
                <a href="${whatsappUrl}" style="color:#c9a227;text-decoration:none;">WhatsApp</a>.
              </p>
              <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.12em;color:#1a1a1a;">
                Baig Essence
              </p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#a39b8f;">
                Premium fragrances · Crafted in Pakistan
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildAdminEmailHtml(order: Order) {
  const siteUrl = getSiteUrl();

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px;">
      <h2 style="margin:0 0 12px;">New COD order received</h2>
      <p><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.customerEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</p>
      <p><strong>Address:</strong><br/>
        ${escapeHtml(order.shippingAddress)}<br/>
        ${escapeHtml(order.shippingCity)}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${orderItemsRows(order)}
      </table>
      <p style="margin:4px 0;"><strong>Subtotal:</strong> ${formatPrice(order.subtotal)}</p>
      <p style="margin:4px 0;"><strong>Shipping:</strong> ${
        order.shipping === 0 ? "Free" : formatPrice(order.shipping)
      }</p>
      <p style="margin:4px 0;font-size:16px;"><strong>Total (COD):</strong> ${formatPrice(order.total)}</p>
      <p style="margin-top:16px;">
        <a href="${siteUrl}/admin/orders">View orders in admin</a>
      </p>
    </div>
  `;
}

function logEmailResults(
  results: PromiseSettledResult<{ error: unknown }>[]
) {
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Order email failed:", result.reason);
    } else if (result.value.error) {
      console.error("Order email error:", result.value.error);
    }
  }
}

function buildStatusUpdateEmailHtml(order: Order) {
  const siteUrl = getSiteUrl();
  const statusLabel = FULFILLMENT_LABELS[order.fulfillmentStatus];
  const statusDescription =
    FULFILLMENT_DESCRIPTIONS[order.fulfillmentStatus];
  const whatsappUrl = getWhatsAppUrl(
    `Hi Baig Essence, I have a question about order ${order.orderNumber}.`
  );
  const noteBlock = order.trackingNote
    ? `
      <tr>
        <td style="padding:8px 32px 8px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf8f4;border:1px solid #ebe6dc;">
            <tr>
              <td style="padding:16px 18px;">
                <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c9a227;">
                  Courier note
                </p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.5;">
                  ${escapeHtml(order.trackingNote)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(statusLabel)} — ${escapeHtml(order.orderNumber)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f0e8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f0e8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5dfd3;">
          <tr>
            <td style="background:#1a1a1a;padding:36px 32px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.28em;color:#ffffff;font-weight:400;">
                BAIG
              </p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.45em;color:#c9a227;text-transform:uppercase;">
                — Essence —
              </p>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;color:#b8b0a4;text-transform:uppercase;">
                Order update
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:#c9a227;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1a1a1a;line-height:1.3;">
                Hi ${escapeHtml(order.customerName)}
              </p>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#5c564c;">
                There&apos;s an update on your order
                <strong style="color:#1a1a1a;">${escapeHtml(order.orderNumber)}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf8f4;border:1px solid #ebe6dc;">
                <tr>
                  <td style="padding:22px;text-align:center;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8276;">
                      Current status
                    </p>
                    <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#c9a227;">
                      ${escapeHtml(statusLabel)}
                    </p>
                    <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#5c564c;">
                      ${escapeHtml(statusDescription)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${noteBlock}
          <tr>
            <td style="padding:16px 32px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c9a227;">
                Your items
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${orderItemsRows(order)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;text-align:center;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#5c564c;">
                Payment: Cash on Delivery · Total
                <strong style="color:#1a1a1a;">${formatPrice(order.total)}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 36px;text-align:center;">
              <a href="${siteUrl}/track-order?order=${encodeURIComponent(order.orderNumber)}"
                 style="display:inline-block;padding:14px 28px;background:#1a1a1a;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">
                Track your order
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#faf8f4;border-top:1px solid #ebe6dc;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#5c564c;">
                Questions? Call
                <a href="tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}" style="color:#c9a227;text-decoration:none;">${SITE_PHONE_DISPLAY}</a>
                or
                <a href="${whatsappUrl}" style="color:#c9a227;text-decoration:none;">WhatsApp</a>.
              </p>
              <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.12em;color:#1a1a1a;">
                Baig Essence
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderEmails(order: Order): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not set — order emails were skipped for",
      order.orderNumber
    );
    return;
  }

  const from = getFromAddress();
  const adminEmail = getAdminNotifyEmail();

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: order.customerEmail,
      subject: `Order confirmed — ${order.orderNumber} | Baig Essence`,
      html: buildCustomerEmailHtml(order),
    }),
    resend.emails.send({
      from,
      to: adminEmail,
      subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} COD`,
      html: buildAdminEmailHtml(order),
    }),
  ]);

  logEmailResults(results);
}

/** Email the customer when admin updates fulfillment status. */
export async function sendOrderStatusUpdateEmail(
  order: Order
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not set — status update email skipped for",
      order.orderNumber
    );
    return;
  }

  const statusLabel = FULFILLMENT_LABELS[order.fulfillmentStatus];
  const result = await resend.emails.send({
    from: getFromAddress(),
    to: order.customerEmail,
    subject: `${statusLabel} — ${order.orderNumber} | Baig Essence`,
    html: buildStatusUpdateEmailHtml(order),
  });

  if (result.error) {
    console.error("Status update email error:", result.error);
  }
}
