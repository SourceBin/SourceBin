import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { RATE_LIMITER_OPTIONS } from './rate-limiter.constants';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';
import { RateLimiterOptions } from './rate-limiter.interface';

@Module({})
export class RateLimiterModule {
  static register(opts: RateLimiterOptions): DynamicModule {
    return {
      module: RateLimiterModule,
      providers: [
        { provide: RATE_LIMITER_OPTIONS, useValue: opts },
        { provide: APP_INTERCEPTOR, useClass: RateLimiterInterceptor },
      ],
    };
  }
}
