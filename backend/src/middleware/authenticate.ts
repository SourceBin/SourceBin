import { RequestHandler } from 'express';
import passport from 'passport';

import { replyError } from '../utils/errors';

function auth(strategy: string | string[]): RequestHandler {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        replyError(500, 'Internal Server Error', res);
        return;
      }

      if (info instanceof Error) {
        replyError(401, 'Unauthorized', res);
        return;
      }

      req.user = user;
      next();
    })(req, res, next);
  };
}

export const requiredAuth = auth('jwt');
export const optionalAuth = auth(['jwt', 'anonymous']);
