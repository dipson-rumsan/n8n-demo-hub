const baseURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL;
const voxBaseURL = process.env.NEXT_PUBLIC_VOX_API;
const facebookURL = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const discordURL = process.env.NEXT_PUBLIC_DISCORD_URL;
const telegramURL = process.env.NEXT_PUBLIC_TELEGRAM_URL;
const communityToolURL = process.env.NEXT_PUBLIC_COMMUNITY_TOOL;
const aiQuizURL = process.env.NEXT_PUBLIC_AI_QUIZ;


export const URLS = {
  CUSTOMER_SUPPORT: baseURL + "/webhook/customer-support",
  CV_FORM: baseURL + "/webhook/cv-form",
  SICK_LEAVE: baseURL + "/webhook/sick-leave",
  RETELL_TOKEN: "/api/create-call",
  VOX_FLOW: voxBaseURL,
  AI_QUIZ: aiQuizURL,
  COMMUNITY_TOOL: communityToolURL,
};

export const PAGES = {
  FACEBOOK_URL: facebookURL,
  DISCORD_URL: discordURL,
  TELEGRAM_URL: telegramURL,
};
export const RETELL_CONFIG = {
  SAMPLE_RATE: 24000,
  EMIT_RAW_AUDIO_SAMPLES: false,
};

export const VOICE_AGENT_CONFIG = {
  WIDGET_URL: process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "",
};
