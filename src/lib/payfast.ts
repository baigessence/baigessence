import { createHash } from "crypto";
import { getSiteUrl } from "./utils";

const PAYFAST_ENDPOINTS = {
  sandbox: {
    token:
      "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken",
    checkout:
      "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction",
  },
  production: {
    token: "https://ipg.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken",
    checkout:
      "https://ipg.apps.net.pk/Ecommerce/api/Transaction/PostTransaction",
  },
} as const;

type PayfastEnvironment = keyof typeof PAYFAST_ENDPOINTS;

function getPayfastEnvironment(): PayfastEnvironment {
  return process.env.PAYFAST_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";
}

function getPayfastMerchantId(): string {
  const id = process.env.PAYFAST_MERCHANT_ID;
  if (!id) {
    throw new Error("Missing PAYFAST_MERCHANT_ID");
  }
  return id;
}

function getPayfastSecuredKey(): string {
  const key = process.env.PAYFAST_SECURED_KEY;
  if (!key) {
    throw new Error("Missing PAYFAST_SECURED_KEY");
  }
  return key;
}

function getPayfastMerchantName(): string {
  return process.env.PAYFAST_MERCHANT_NAME?.trim() || "BaigEssence";
}

function getTokenUrl(): string {
  return (
    process.env.PAYFAST_TOKEN_URL ??
    PAYFAST_ENDPOINTS[getPayfastEnvironment()].token
  );
}

function getCheckoutUrl(): string {
  return (
    process.env.PAYFAST_CHECKOUT_URL ??
    PAYFAST_ENDPOINTS[getPayfastEnvironment()].checkout
  );
}

export function formatPayfastAmount(amountPkr: number): string {
  return amountPkr.toFixed(2);
}

export function formatPayfastMobile(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("92")) {
    return `92-${digits.slice(2)}`;
  }

  if (digits.startsWith("0")) {
    return `92-${digits.slice(1)}`;
  }

  return `92-${digits}`;
}

export function createPayfastSignature(
  merchantId: string,
  merchantName: string,
  amount: string,
  basketId: string
): string {
  return createHash("md5")
    .update(`${merchantId}:${merchantName}:${amount}:${basketId}`)
    .digest("hex");
}

export function verifyPayfastSignature(
  amount: string,
  basketId: string,
  signature: string
): boolean {
  const merchantId = getPayfastMerchantId();
  const merchantName = getPayfastMerchantName();
  const expected = createPayfastSignature(
    merchantId,
    merchantName,
    amount,
    basketId
  );
  return expected.toLowerCase() === signature.toLowerCase();
}

async function fetchPayfastAccessToken(
  basketId: string,
  amount: string
): Promise<string> {
  const body = new URLSearchParams({
    MERCHANT_ID: getPayfastMerchantId(),
    SECURED_KEY: getPayfastSecuredKey(),
    TXNAMT: amount,
    BASKET_ID: basketId,
    CURRENCY_CODE: "PKR",
  });

  const response = await fetch(getTokenUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "BaigEssence/1.0",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const raw = await response.text();
  let payload: Record<string, string> = {};

  try {
    payload = JSON.parse(raw) as Record<string, string>;
  } catch {
    throw new Error(
      `PayFast token request failed (${response.status}): ${raw.slice(0, 200)}`
    );
  }

  const token = payload.ACCESS_TOKEN ?? payload.access_token ?? payload.token;

  if (!token) {
    const message =
      payload.ERROR_MESSAGE ??
      payload.message ??
      payload.MESSAGE ??
      "PayFast did not return an access token";
    throw new Error(message);
  }

  return token;
}

type CreatePayfastCheckoutInput = {
  basketId: string;
  amountPkr: number;
  customer: {
    email: string;
    phone: string;
  };
};

export type PayfastCheckoutForm = {
  formAction: string;
  formFields: Record<string, string>;
};

export async function createPayfastCheckoutForm(
  input: CreatePayfastCheckoutInput
): Promise<PayfastCheckoutForm> {
  const siteUrl = getSiteUrl();
  const merchantId = getPayfastMerchantId();
  const merchantName = getPayfastMerchantName();
  const amount = formatPayfastAmount(input.amountPkr);
  const mobile = formatPayfastMobile(input.customer.phone);
  const orderDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const signature = createPayfastSignature(
    merchantId,
    merchantName,
    amount,
    input.basketId
  );

  const token = await fetchPayfastAccessToken(input.basketId, amount);

  const callbackQuery = new URLSearchParams({
    signature,
    basket_id: input.basketId,
  });

  const formFields: Record<string, string> = {
    CURRENCY_CODE: "PKR",
    MERCHANT_ID: merchantId,
    MERCHANT_NAME: merchantName,
    TOKEN: token,
    BASKET_ID: input.basketId,
    TXNAMT: amount,
    ORDER_DATE: orderDate,
    SUCCESS_URL: `${siteUrl}/checkout/success`,
    FAILURE_URL: `${siteUrl}/checkout/cancel`,
    CHECKOUT_URL: `${siteUrl}/api/webhooks/payfast?${callbackQuery.toString()}`,
    CUSTOMER_EMAIL_ADDRESS: input.customer.email,
    CUSTOMER_MOBILE_NO: mobile,
    SIGNATURE: signature,
    VERSION: "BAIGESSENCE-1.0",
    TXNDESC: `BaigEssence order ${input.basketId}`,
    PROCCODE: "00",
  };

  return {
    formAction: getCheckoutUrl(),
    formFields,
  };
}
