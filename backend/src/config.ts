import { minutes } from './utils/time';

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
  },
  external: {
    get: {
      windowMs: minutes(10),
      max: 60, // every 10s
    },
  },
};

export const bin = {
  maxContentLength: 100_000,
  maxLanguageLength: 100,
};
