import {
  seconds, minutes, weeks,
  limit,
} from './utils/time';

export const rateLimits = {
  bins: {
    get: limit({ window: minutes(1), every: seconds(1) }),
    create: limit({ window: minutes(10), every: seconds(30) }),
    disown: limit({ window: minutes(10), every: seconds(10) }),
  },
  code: {
    classify: limit({ window: minutes(10), every: seconds(10) }),
  },
  user: {
    get: limit({ window: minutes(10), every: seconds(10) }),
    bins: limit({ window: minutes(1), every: seconds(1) }),
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
