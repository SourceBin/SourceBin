import { Request } from 'express';

export interface RateLimitOptions {
  window?: number;
  every: number;
}

export interface RateLimiterOptions {
  keyGenerator?: (req: Request) => string;
}
