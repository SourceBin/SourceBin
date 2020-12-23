import { asString } from '../utils/asserts.util';

export const MONGODB_URI = asString(process.env.MONGODB_URI);
export const REDIS_URL = asString(process.env.REDIS_URL);
export const GCLOUD_BUCKET = asString(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
