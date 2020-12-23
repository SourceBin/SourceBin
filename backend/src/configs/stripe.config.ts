import { asString } from '../utils/asserts.util';

export const KEY = asString(process.env.STRIPE_SECRET_KEY);
export const WEBHOOK_SECRET = asString(process.env.STRIPE_WEBHOOK_SECRET);

export const PRO_MONTHLY = asString(process.env.STRIPE_PRO_MONTHLY);
export const PRO_YEARLY = asString(process.env.STRIPE_PRO_YEARLY);
