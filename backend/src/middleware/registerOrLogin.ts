import { Response, RequestHandler } from 'express';
import passport from 'passport';
import { format } from 'url';

function redirectError(res: Response, error: string): void {
  res.redirect(format({
    pathname: '/account',
    query: {
      error,
    },
  }));
}

export function registerOrLogin(strategy: string): RequestHandler {
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

        if (info && info.error) {
          redirectError(res, info.error);
          return;
        }

        req.user = user;
        next();
      },
    )(req, res, next);
  };
}
