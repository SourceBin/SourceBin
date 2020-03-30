import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { User, UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';

import * as config from '../config';

export async function createOrGetUser(conditions: any, data: any): Promise<User> {
  const user = await UserModel.findOne(conditions);

  if (user) {
    return user;
  }

  return UserModel.create(data);
}

export function generateRefreshToken(): Promise<string> {
  return new Promise((res, rej) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        rej(err);
      } else {
        res(buffer.toString('base64'));
      }
    });
  });
}

export function hashRefreshToken(refreshToken: string): string {
  return crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('base64');
}

export async function setAccessRefreshTokens(res: Response, user: User): Promise<void> {
  const refreshToken = await generateRefreshToken();

  await RefreshTokenModel.create({
    token: hashRefreshToken(refreshToken),
    user: user._id,
  });

  const accessToken = jwt.sign(
    { sub: user.email },
    process.env.JWT_SECRET || '',
    { expiresIn: config.auth.accessTokenTTL / 1000 },
  );

  const expires = new Date(Date.now() + config.auth.refreshTokenTTL);

  res.cookie('access_token', accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires,
  });

  res.cookie('refresh_token', refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires,
  });
}

export function unsetAccessRefreshTokens(res: Response): void {
  res.clearCookie('access_token', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });

  res.clearCookie('refresh_token', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}
