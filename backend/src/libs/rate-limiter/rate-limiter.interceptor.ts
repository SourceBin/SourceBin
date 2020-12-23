import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  RateLimiterAbstract,
  IRateLimiterOptions as RateLimiterFlexibleOptions,
  RateLimiterMemory,
  RateLimiterRes,
} from 'rate-limiter-flexible';
import { Observable } from 'rxjs';

import { minutes } from '../../utils/time.util';
import { RATE_LIMITER_OPTIONS } from './rate-limiter.constants';
import { RateLimitOptions, RateLimiterOptions } from './rate-limiter.interface';

type LimitOptions = Required<
  Pick<RateLimiterFlexibleOptions, 'points' | 'duration'>
>;

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private readonly limiters = new Map<string, RateLimiterAbstract>();

  constructor(
    @Inject(RATE_LIMITER_OPTIONS)
    private readonly globalOpts: RateLimiterOptions,
    private readonly reflector: Reflector,
  ) {}

  private getLimiter(req: Request, opts: LimitOptions): RateLimiterAbstract {
    const key = `${req.method}:${req.route.path}`;

    let limiter = this.limiters.get(key);

    if (!limiter) {
      limiter = new RateLimiterMemory({
        keyPrefix: key,
        ...opts,
      });

      this.limiters.set(key, limiter);
    }

    return limiter;
  }

  private setHeaders(
    res: Response,
    rateLimitRes: RateLimiterRes,
    opts: LimitOptions,
  ): void {
    res.setHeader('X-RateLimit-Limit', opts.points);
    res.setHeader('X-RateLimit-Remaining', rateLimitRes.remainingPoints);
    res.setHeader(
      'X-RateLimit-Reset',
      Math.ceil((Date.now() + rateLimitRes.msBeforeNext) / 1000),
    );
  }

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    const rateLimitOpts = this.reflector.get<RateLimitOptions | undefined>(
      'rateLimit',
      ctx.getHandler(),
    );

    if (!rateLimitOpts) {
      return next.handle();
    }

    const window = rateLimitOpts.window ?? minutes(15);
    const opts: LimitOptions = {
      duration: window / 1000,
      points: Math.ceil(window / rateLimitOpts.every),
    };

    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();

    const limiter = this.getLimiter(req, opts);
    const key = this.globalOpts.keyGenerator?.(req) ?? req.ip;

    try {
      const ratelimitRes = await limiter.consume(key);

      this.setHeaders(res, ratelimitRes, opts);
    } catch (rateLimitRes) {
      this.setHeaders(res, rateLimitRes, opts);

      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }
}
