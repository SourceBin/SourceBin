import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Response } from 'express';
import { Model, Query } from 'mongoose';

import { mockDocument } from '../../../test/utils';
import { AuthConfig } from '../../configs';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../../schemas/refreshtoken.schema';
import { User } from '../../schemas/user.schema';
import { AuthService } from './auth.service';

type RefreshTokenQuery = Query<RefreshTokenDocument, RefreshTokenDocument>;

describe('AuthService', () => {
  let authService: AuthService;
  let refreshTokenModel: Model<RefreshTokenDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(RefreshToken.name),
          useValue: {
            create: jest.fn(),
            deleteOne: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: AuthConfig.KEY,
          useValue: {
            JWT: {
              SECRET: 'secret',
            },
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    refreshTokenModel = module.get(getModelToken(RefreshToken.name));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('redirectError', () => {
    it('should redirect to login', () => {
      const res = createMock<Response>();

      authService.redirectError(res, new Error('some error'));

      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/login?error=some%20error');
    });
  });

  describe('setNewAccessRefreshToken', () => {
    it('should generate a valid refresh token', async () => {
      jest
        .spyOn(refreshTokenModel, 'create')
        .mockResolvedValueOnce(undefined as never);

      const mockDate = 1609173387977;
      const expireDate = mockDate + 2419200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);

      const res = createMock<Response>();
      const user = mockDocument(User, { _id: 'id' });

      await authService.setNewAccessRefreshToken(res, user);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZCIsImlhdCI6MTYwOTE3MzM4NywiZXhwIjoxNjA5MTc0Mjg3fQ.oqPNmjlEniEXcGmjaMTsR2KEWinvTHp8TK82N_vIZAE',
        {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          expires: new Date(expireDate),
        },
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.anything(),
        {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          expires: new Date(expireDate),
        },
      );
    });
  });

  describe('unsetAccessRefreshToken', () => {
    it('should clear the access and refresh token', () => {
      const res = createMock<Response>();

      authService.unsetAccessRefreshToken(res);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenCalledWith('access_token', {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });
    });
  });

  describe('findRefreshToken', () => {
    it('should return the refresh token and delete it', async () => {
      jest.spyOn(refreshTokenModel, 'findOneAndDelete').mockReturnValueOnce(
        createMock<RefreshTokenQuery>({
          select: jest.fn().mockReturnValueOnce(
            createMock<RefreshTokenQuery>({
              populate: jest.fn().mockReturnValueOnce(
                createMock<RefreshTokenQuery>({
                  exec: jest
                    .fn()
                    .mockResolvedValueOnce(
                      mockDocument(RefreshToken, { _id: 'hashed id' }),
                    ),
                }),
              ),
            }),
          ),
        }),
      );

      await expect(authService.findRefreshToken('id')).resolves.toEqual(
        mockDocument(RefreshToken, { _id: 'hashed id' }),
      );
    });
  });

  describe('generateTokenAndRedirect', () => {
    it('should set tokens and redirect to account if no state is provided', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(res, mockDocument(User, {}));

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should redirect to account if state is provided without redirect', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(
        res,
        mockDocument(User, {}),
        Buffer.from('{}').toString('base64'),
      );

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should redirect to account if state is provided but not valid', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(
        res,
        mockDocument(User, {}),
        Buffer.from('{"redirect":5}').toString('base64'),
      );

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should redirect to account if state is not json', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(
        res,
        mockDocument(User, {}),
        Buffer.from('{').toString('base64'),
      );

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/account');
    });

    it('should redirect to the provided path', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(
        res,
        mockDocument(User, {}),
        Buffer.from('{"redirect":"/path"}').toString('base64'),
      );

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/path');
    });

    it('should redirect to the provided path if a full url is provided', async () => {
      jest
        .spyOn(authService, 'setNewAccessRefreshToken')
        .mockResolvedValueOnce(undefined);

      const res = createMock<Response>();
      await authService.generateTokenAndRedirect(
        res,
        mockDocument(User, {}),
        Buffer.from('{"redirect":"https://example.com/path"}').toString(
          'base64',
        ),
      );

      expect(authService.setNewAccessRefreshToken).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/path');
    });
  });

  describe('deleteRefreshToken', () => {
    it('deletes the refresh token', async () => {
      jest.spyOn(refreshTokenModel, 'deleteOne').mockReturnValueOnce(
        createMock<RefreshTokenQuery>({
          exec: jest.fn().mockResolvedValueOnce(undefined),
        }),
      );

      await authService.deleteRefreshToken('id');
    });
  });
});
