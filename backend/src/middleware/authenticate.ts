import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { replyError } from '../utils/errors';

const STRATS = ['jwt', 'anonymous'];

export function auth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate(STRATS, { session: false }, (err, user, info) => {
    if (info instanceof Error) {
      replyError(401, 'Unauthorized', res);
      return;
    }

    if (err) {
      replyError(400, 'Failed to authenticate', res);
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
}

export function requiredAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.user) {
    next();
  } else {
    replyError(401, 'Unauthorized', res);
  }
}
