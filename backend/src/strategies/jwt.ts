import { Request } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-jwt';

import { UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';

import { hashRefreshToken, setAccessRefreshTokens, unsetAccessRefreshTokens } from '../utils/auth';

passport.use(new Strategy(
  {
    jwtFromRequest: req => req.cookies.access_token,
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: true,
    passReqToCallback: true,
  },
  async (req: Request, payload: any, done: any) => {
    try {
      const isExpired = payload.exp * 1000 - Date.now() < 0;

      // If the access token is valid get the user
      if (!isExpired) {
        const user = await UserModel
          .findOne({ email: payload.sub })
          .exec();

        done(undefined, user);
        return;
      }

      // req.res is used to set the cookies, if it's undefined something's wrong
      if (!req.res) {
        done('Authentication failed');
        return;
      }

      const refreshToken = req.cookies.refresh_token;

      // If no refresh token is provided the user is logged out
      if (!refreshToken) {
        unsetAccessRefreshTokens(req.res);
        done('Expired access token');
        return;
      }

      // Find the refresh token in the database
      // This can only be done once per refresh token, as it's deleted afterwards
      const token = await RefreshTokenModel
        .findOneAndDelete({ token: hashRefreshToken(refreshToken) })
        .select('-_id token user')
        .populate('user')
        .exec();

      // If the token was found and the user matches new tokens are created
      if (token && token.user.email === payload.sub) {
        await setAccessRefreshTokens(req.res, token.user);
        done(undefined, token.user);
        return;
      }

      // The refresh token is invalid
      unsetAccessRefreshTokens(req.res);
      done('Invalid refresh token');
    } catch (err) {
      console.error(err);
      done(err);
    }
  },
));
