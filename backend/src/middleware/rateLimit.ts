import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import { rateLimits } from '../config';

import { redis } from '../utils/redis';
import { replyError } from '../utils/errors';

export function rateLimit<T extends keyof typeof rateLimits>(
  ns: T,
  route: keyof typeof rateLimits[T],
): RateLimit.Instance {
  return new RateLimit({
    store: new RedisStore({
      prefix: `rl:${ns}.${route}:`,
      client: redis,
    }),
    handler(_, res) {
      replyError(429, 'You are being rate limited', res);
    },
    keyGenerator(req) {
      return req.user
        ? req.user._id
        : req.ip;
    },

    ...rateLimits[ns][route],
  });
}
