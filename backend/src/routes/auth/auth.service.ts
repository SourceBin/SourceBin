import crypto from 'crypto';
import url from 'url';
import { promisify } from 'util';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

import { AuthConfig } from '../../configs';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../../configs/auth.config';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../../schemas/refreshtoken.schema';
import { User } from '../../schemas/user.schema';

const randomBytes = promisify(crypto.randomBytes);

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const COOKIE_SETTINGS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
  ) {}

  redirectError(res: Response, err: Error): void {
    res.redirect(
      url.format({
        pathname: '/login',
        query: {
          error: err.message,
        },
      }),
    );
  }

  async generateRefreshToken(): Promise<string> {
    const bytes = await randomBytes(32);
    return bytes.toString('base64');
  }

  hashRefreshToken(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('base64');
  }

  async setNewAccessRefreshToken(res: Response, user: User): Promise<void> {
    const refreshToken = await this.generateRefreshToken();

    await new this.refreshTokenModel({
      _id: this.hashRefreshToken(refreshToken),
      user: user,
    }).save();

    const accessToken = jwt.sign(
      { sub: user._id },
      this.authConfig.JWT.SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL / 1000,
      },
    );

    const expires = new Date(Date.now() + REFRESH_TOKEN_TTL);

    res.cookie(ACCESS_TOKEN, accessToken, {
      ...COOKIE_SETTINGS,
      expires,
    });

    res.cookie(REFRESH_TOKEN, refreshToken, {
      ...COOKIE_SETTINGS,
      expires,
    });
  }

  unsetAccessRefreshToken(res: Response): void {
    res.clearCookie(ACCESS_TOKEN, COOKIE_SETTINGS);
    res.clearCookie(REFRESH_TOKEN, COOKIE_SETTINGS);
  }

  findRefreshToken(refreshToken: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel
      .findOneAndDelete({ _id: this.hashRefreshToken(refreshToken) })
      .select('_id user')
      .populate('user')
      .exec();
  }

  extractRedirect(state: string): string | null {
    const { redirect } = JSON.parse(Buffer.from(state, 'base64').toString());

    if (redirect) {
      try {
        return url.parse(redirect).path;
      } catch {
        return null;
      }
    }

    return null;
  }

  async generateTokenAndRedirect(
    res: Response,
    user: User,
    state?: string,
  ): Promise<void> {
    await this.setNewAccessRefreshToken(res, user);

    if (state) {
      const redirect = this.extractRedirect(state);

      if (redirect) {
        return res.redirect(redirect);
      }
    }

    res.redirect('/account');
  }

  deleteRefreshToken(refreshToken: string): Promise<void> {
    return this.refreshTokenModel
      .deleteOne({ _id: this.hashRefreshToken(refreshToken) })
      .exec();
  }
}
