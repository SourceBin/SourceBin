import { SetMetadata } from '@nestjs/common';

import { RateLimitOptions } from './rate-limiter.interface';

export const RateLimit = (options: RateLimitOptions): MethodDecorator =>
  SetMetadata('rateLimit', options);
