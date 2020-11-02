import Redis from 'ioredis';
import mongoose from 'mongoose';

import { minutes } from './time';

export const redis = new Redis(process.env.REDIS_URL);

export async function countHit(key: string, user: string): Promise<boolean> {
  const exists = await redis.exists(`${key}:${user}`);

  if (exists) {
    return false;
  }

  await redis.set(`${key}:${user}`, 0, 'PX', minutes(15));
  return true;
}

export async function cacheLoad<T extends mongoose.Document>(
  Model: mongoose.Model<T>,
  cacheKey: string,
  otherwise: (Model: mongoose.Model<T>) => Promise<T | null>,
): Promise<T | null> {
  const cached = await redis.get(cacheKey);

  return cached
    ? Model.hydrate(JSON.parse(cached))
    : otherwise(Model);
}

export async function cacheSave(
  doc: mongoose.Document,
  cacheKey: string,
  duration: number,
): Promise<void> {
  await redis.set(cacheKey, JSON.stringify(doc.toJSON()), 'PX', duration);
}
