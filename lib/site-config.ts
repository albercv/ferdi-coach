export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ferdycoachdesamor.com"

export const SITE_HOST = new URL(SITE_URL).host

export const CONTACT_EMAIL = "ferdycoachdesamor@gmail.com"
export const CONTACT_PHONE = "+34 651 611 463"
export const CONTACT_PHONE_E164 = "+34651611463"

export const SOCIAL_INSTAGRAM = "https://instagram.com/ferdycoach_desamor"
export const SOCIAL_TIKTOK = "https://tiktok.com/@ferdycoach_desamor"
