import redis from 'redis';
import { promisify } from 'util';

export const client = redis.createClient(process.env.REDIS_URL || '');

export const get: any = promisify(client.get).bind(client);
export const set: any = promisify(client.set).bind(client);
