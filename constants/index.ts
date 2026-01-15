const baseURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL;

export const URLS = {
  CUSTOMER_SUPPORT: baseURL + "/webhook/customer-support",
  CV_FORM: baseURL + "/webhook/cv-form",
  SICK_LEAVE: baseURL + "/webhook/sick-leave",
  RETELL_TOKEN: "/api/create-call",
};

export const PAGES = {
  FACEBOOK_URL: "https://www.facebook.com/askbhunte",
  DISCORD_URL: "https://discord.gg/ZaHWRcVN",
  TELEGRAM_URL: "https://t.me/aurora_raktim_bot",
};

export const RETELL_CONFIG = {
  SAMPLE_RATE: 24000,
  EMIT_RAW_AUDIO_SAMPLES: false,
};
