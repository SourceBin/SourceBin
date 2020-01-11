const second = (x: number): number => x * 1000;
const minute = (x: number): number => x * second(60);

export const rateLimits = {
  bins: {
    get: {
      windowMs: minute(1),
      max: minute(1), // every ms
    },
    create: {
      windowMs: minute(10),
      max: 60, // every 10s
    },
  },
};

export const bin = {
  maxContentLength: 100_000,
  maxLanguageLength: 100,
};
