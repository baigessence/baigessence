import Safepay from "@sfpy/node-core";
import { getSiteUrl } from "./utils";

function getSafepayHost(): string {
  const env = process.env.SAFEPAY_ENVIRONMENT ?? "sandbox";
  return env === "production"
    ? "https://api.getsafepay.com"
    : "https://sandbox.api.getsafepay.com";
}

function getSafepayEnvironment(): "sandbox" | "production" {
  return process.env.SAFEPAY_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";
}

function getSafepaySecretKey(): string {
  const key = process.env.SAFEPAY_SECRET_KEY;
  if (!key) {
    throw new Error("Missing SAFEPAY_SECRET_KEY");
  }
  if (key.startsWith("sec_")) {
    throw new Error(
      "SAFEPAY_SECRET_KEY looks like your Public key. Use the long Secret key from the Safepay dashboard instead."
    );
  }
  return key;
}

export function createSafepayClient() {
  return new Safepay(getSafepaySecretKey(), {
    authType: "secret",
    host: getSafepayHost(),
  });
}

export function getSafepayMerchantApiKey(): string {
  const key = process.env.SAFEPAY_MERCHANT_API_KEY;
  if (!key) {
    throw new Error(
      "Missing SAFEPAY_MERCHANT_API_KEY (your Safepay Public key starting with sec_)"
    );
  }
  if (!key.startsWith("sec_")) {
    throw new Error(
      "SAFEPAY_MERCHANT_API_KEY must be your Safepay Public key (starts with sec_)"
    );
  }
  return key;
}

type CreateCheckoutSessionInput = {
  orderId: string;
  orderNumber: string;
  amountPkr: number;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

export async function createSafepayCheckoutSession(
  input: CreateCheckoutSessionInput
) {
  const safepay = createSafepayClient();
  const siteUrl = getSiteUrl();
  const environment = getSafepayEnvironment();

  let customerToken: string | undefined;

  if (input.customer) {
    const customerResponse = await safepay.customers.object.create({
      first_name: input.customer.firstName,
      last_name: input.customer.lastName,
      email: input.customer.email,
      phone_number: input.customer.phone,
      country: "PK",
      is_guest: true,
    });
    customerToken = customerResponse.data?.token;
  }

  const merchantApiKey = getSafepayMerchantApiKey();

  const sessionResponse = await safepay.payments.session.setup({
    merchant_api_key: merchantApiKey,
    intent: "CYBERSOURCE",
    mode: "payment",
    entry_mode: "raw",
    currency: "PKR",
    amount: input.amountPkr * 100,
    metadata: {
      order_id: input.orderId,
    },
    include_fees: false,
    ...(customerToken ? { user: customerToken } : {}),
  });

  const tracker = sessionResponse.data?.tracker;
  const trackerToken = tracker?.token;
  const clientKey = tracker?.client ?? merchantApiKey;

  if (!trackerToken) {
    throw new Error("Safepay did not return a payment tracker");
  }

  if (sessionResponse.data?.capabilities?.CYBERSOURCE === false) {
    throw new Error(
      "Card payments are not enabled on your Safepay account. Enable CYBERSOURCE in the Safepay sandbox dashboard or contact Safepay support."
    );
  }

  const authResponse = await safepay.client.passport.create({
    merchant_api_key: clientKey,
  });
  const authToken = authResponse.data;
  if (!authToken || typeof authToken !== "string") {
    throw new Error("Safepay did not return an authentication token");
  }

  const checkoutUrl = safepay.checkout.createCheckoutUrl({
    env: environment,
    tracker: trackerToken,
    tbt: authToken,
    source: "hosted",
    client: clientKey,
    ...(customerToken ? { user_id: customerToken } : {}),
    redirect_url: `${siteUrl}/checkout/success`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  } as Parameters<typeof safepay.checkout.createCheckoutUrl>[0]);

  return {
    checkoutUrl,
    trackerToken,
  };
}

export async function fetchSafepayTracker(trackerToken: string) {
  const safepay = createSafepayClient();
  return safepay.reporter.payments.fetch(trackerToken);
}

export function isSafepayPaymentComplete(trackerState?: string): boolean {
  return trackerState === "TRACKER_ENDED";
}
