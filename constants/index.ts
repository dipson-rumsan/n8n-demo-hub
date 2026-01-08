const baseURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL;

console.log({ baseURL });

export const URLS = {
  CUSTOMER_SUPPORT: baseURL + "/webhook/customer-support",
  CV_FORM: baseURL + "/webhook/cv-form",
  SICK_LEAVE: baseURL + "/webhook/sick-leave",
};

export const PAGES = {
  FACEBOOK_URL: "https://www.facebook.com/askbhunte",
  DISCORD_URL: "https://discord.gg/ZaHWRcVN",
};
