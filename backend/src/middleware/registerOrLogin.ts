import { Response, RequestHandler } from 'express';
import passport from 'passport';
import { format } from 'url';

function redirectError(res: Response, error: string): void {
  res.redirect(format({
    pathname: '/login',
    query: {
      error,
    },
  }));
}

export function registerOrLogin(strategy: string): RequestHandler {
  return (req, res, next) => {
    const { redirect } = req.query;

    const state = {
      redirect,
    };

    passport.authenticate(
      strategy,
      {
        session: false,
        state: Buffer.from(JSON.stringify(state)).toString('base64'),
      },
    )(req, res, next);
  };
}

export function registerOrLoginCallback(strategy: string): RequestHandler {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (err, user, info) => {
        if (err) {
          console.error(err);

          redirectError(res, 'Authentication failed. Please try again later.');
          return;
        }

        if (info instanceof Error) {
          redirectError(res, info.message);
          return;
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  };
}
