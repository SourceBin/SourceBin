import { registerAs } from '@nestjs/config';

import { asString } from '../utils/asserts.util';

export const AuthConfig = registerAs('auth', () => ({
  JWT: {
    SECRET: asString(process.env.JWT_SECRET),
  },

  DISCORD: {
    ID: asString(process.env.DISCORD_OAUTH_ID),
    SECRET: asString(process.env.DISCORD_OAUTH_SECRET),
    CALLBACK_URL: asString(process.env.DISCORD_OAUTH_CALLBACK_URL),
  },

  GITHUB: {
    ID: asString(process.env.GITHUB_OAUTH_ID),
    SECRET: asString(process.env.GITHUB_OAUTH_SECRET),
    CALLBACK_URL: asString(process.env.GITHUB_OAUTH_CALLBACK_URL),
  },
}));

export const DatabaseConfig = registerAs('database', () => ({
  MONGODB_URI: asString(process.env.MONGODB_URI),
  REDIS_URL: asString(process.env.REDIS_URL),
  GCLOUD_BUCKET: asString(process.env.GOOGLE_CLOUD_STORAGE_BUCKET),
}));

export const StripeConfig = registerAs('stripe', () => ({
  KEY: asString(process.env.STRIPE_SECRET_KEY),
  WEBHOOK_SECRET: asString(process.env.STRIPE_WEBHOOK_SECRET),

  PRO_MONTHLY: asString(process.env.STRIPE_PRO_MONTHLY),
  PRO_YEARLY: asString(process.env.STRIPE_PRO_YEARLY),
}));
