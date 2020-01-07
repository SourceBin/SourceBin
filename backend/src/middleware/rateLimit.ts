import expressRateLimit from 'express-rate-limit';

import { error } from '../utils/errors';

export function rateLimit(options: expressRateLimit.Options): expressRateLimit.Instance {
  if (!options.handler) {
    // eslint-disable-next-line no-param-reassign
    options.handler = (_, res) => error(429, 'You are being rate limited', res);
  }

  return expressRateLimit(options);
}
