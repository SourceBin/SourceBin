import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RateLimiterAbstract } from 'rate-limiter-flexible';
import { of } from 'rxjs';

import { RateLimiterInterceptor } from './rate-limiter.interceptor';

const next = {
  handle: () => of(),
};

describe('RateLimiterInterceptor', () => {
  let reflector: Reflector;
  let interceptor: RateLimiterInterceptor;

  beforeEach(() => {
    reflector = createMock<Reflector>();
    interceptor = new RateLimiterInterceptor({}, reflector);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('getLimiter', () => {
    it('should get a limiter', () => {
      const limiter = interceptor['getLimiter'](
        createMock<Request>({
          method: 'GET',
          route: { path: 'path' },
        }),
        {
          points: 5,
          duration: 10,
        },
      );

      expect(limiter).toBeDefined();
      expect(limiter.getKey('key')).toBe('GET:path:key');
    });

    it('should return an existing instance if called multiple times', () => {
      const req = createMock<Request>({
        method: 'GET',
        route: { path: 'path' },
      });

      const opts = { points: 5, duration: 10 };

      const limiter = interceptor['getLimiter'](req, opts);

      expect(limiter).toBeDefined();
      expect(interceptor['getLimiter'](req, opts)).toBe(limiter);
    });
  });

  describe('setHeaders', () => {
    it('should set the correct headers', () => {
      jest.spyOn(Date, 'now').mockReturnValueOnce(10000);

      const res = createMock<Response>();

      interceptor['setHeaders'](
        res,
        { msBeforeNext: 5000, remainingPoints: 2 } as any,
        { points: 5, duration: 0 },
      );

      expect(res.setHeader).toBeCalledTimes(3);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 2);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', 15);
    });
  });

  describe('intercept', () => {
    it('should not run if no ratelimit is set', async () => {
      jest.spyOn(reflector, 'get').mockReturnValueOnce(undefined);

      const ctx = createMock<ExecutionContext>();

      await interceptor.intercept(ctx, next);

      expect(ctx.getHandler).toHaveBeenCalledTimes(1);
      expect(ctx.switchToHttp).not.toHaveBeenCalled();
    });

    it('should update the limiter', async () => {
      const consume = jest.fn();

      jest.spyOn(reflector, 'get').mockReturnValueOnce({ every: 0 });

      jest.spyOn(interceptor as any, 'getLimiter').mockReturnValueOnce(
        createMock<RateLimiterAbstract>({ consume }),
      );

      jest
        .spyOn(interceptor as any, 'setHeaders')
        .mockReturnValueOnce(undefined);

      const ctx = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({ ip: 'ip' }),
          getResponse: () => ({}),
        }),
      });

      await interceptor.intercept(ctx, next);

      expect(consume).toHaveBeenCalledWith('ip');
    });

    it('should throw too many requests if already exists', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValueOnce({ every: 0, window: 10 });

      jest.spyOn(interceptor as any, 'getLimiter').mockReturnValueOnce(
        createMock<RateLimiterAbstract>({
          consume: jest.fn().mockImplementation(() => {
            throw new Error();
          }),
        }),
      );

      jest
        .spyOn(interceptor as any, 'setHeaders')
        .mockReturnValueOnce(undefined);

      const ctx = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({ ip: 'ip' }),
          getResponse: () => ({}),
        }),
      });

      await expect(interceptor.intercept(ctx, next)).rejects.toThrow(
        new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS),
      );
    });

    it('should use keyGenerator value as key', async () => {
      const consume = jest.fn();

      jest.spyOn(reflector, 'get').mockReturnValueOnce({ every: 0 });

      jest.spyOn(interceptor as any, 'getLimiter').mockReturnValueOnce(
        createMock<RateLimiterAbstract>({ consume }),
      );

      jest
        .spyOn(interceptor as any, 'setHeaders')
        .mockReturnValueOnce(undefined);

      const ctx = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({ user: { id: 'user id' } }),
          getResponse: () => ({}),
        }),
      });

      interceptor['globalOpts'].keyGenerator = (req: any) => req.user.id;
      await interceptor.intercept(ctx, next);

      expect(consume).toHaveBeenCalledWith('user id');
    });
  });
});
