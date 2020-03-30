import { minutes, weeks } from './utils/time';

export const rateLimits = {
  bins: {
    get: {
      windowMs: minutes(1),
      max: minutes(1), // every ms
    },
    create: {
      windowMs: minutes(10),
      max: 60, // every 10s
    },
    delete: {
      windowMs: minutes(10),
      max: 60, // every 10s
    },
  },
  external: {
    get: {
      windowMs: minutes(10),
      max: 60, // every 10s
    },
  },
};

export const bin = {
  maxNameLength: 1000,
  maxContentLength: 100_000,
};

export const auth = {
  accessTokenTTL: minutes(15),
  refreshTokenTTL: weeks(4),
};
