import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { mockDocument } from '../../../../test/utils';
import { User } from '../../../schemas/user.schema';
import { RequiredAuthGuard } from './required.guard';

describe('RequiredAuthGuard', () => {
  let guard: RequiredAuthGuard;

  beforeEach(() => {
    guard = new RequiredAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user is logged in', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockDocument(User, {}),
        }),
      }),
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false if user is not logged in', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: undefined,
        }),
      }),
    });

    expect(guard.canActivate(context)).toBe(false);
  });
});
