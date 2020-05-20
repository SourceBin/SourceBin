import {
  milliseconds, seconds, minutes, weeks,
  limit,
} from './utils/time';

export const rateLimits = {
  billing: {
    customer: limit({ window: minutes(5), every: seconds(10) }),
    plan: limit({ window: minutes(5), every: seconds(10) }),
    coupon: limit({ window: minutes(1), every: seconds(1) }),
    invoice: limit({ window: minutes(5), every: seconds(10) }),
    subscribe: limit({ window: minutes(10), every: minutes(1) }),
    cancel: limit({ window: minutes(10), every: minutes(1) }),
    reenable: limit({ window: minutes(10), every: minutes(1) }),
    webhook: limit({ window: minutes(1), every: milliseconds(10) }),
  },
  bins: {
    get: limit({ window: minutes(1), every: seconds(1) }),
    create: limit({ window: minutes(10), every: seconds(30) }),
    disown: limit({ window: minutes(10), every: seconds(10) }),
  },
  code: {
    classify: limit({ window: minutes(10), every: minutes(10) }),
  },
  user: {
    get: limit({ window: minutes(10), every: seconds(10) }),
    bins: limit({ window: minutes(1), every: seconds(1) }),
  },
};

export const bin = {
  maxTitleLength: 100,
  maxDescriptionLength: 1000,
  maxNameLength: 100,
  maxContentLength: 100_000,
};

export const auth = {
  accessTokenTTL: minutes(15),
  refreshTokenTTL: weeks(4),
};
