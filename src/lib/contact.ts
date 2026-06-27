export const SITE_PHONE = "+923226053521";
export const SITE_PHONE_DISPLAY = "+92 322 6053521";
export const SITE_EMAIL = "baigessence@gmail.com";
export const SITE_ADDRESS = "114B, Naz Town near Valencia town, Lahore";
export const SITE_CITY = "Lahore, Pakistan";

export const WHATSAPP_NUMBER = "923226053521";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/14mMX9NqWMt/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/baigessence?igsh=Nmttbzh4ZG56bnpm",
} as const;

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Baig Essence, I need assistance with my order.";

export function getWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
