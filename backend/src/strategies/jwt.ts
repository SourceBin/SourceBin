import passport from 'passport';
import { Strategy } from 'passport-jwt';

import { UserModel } from '../models/User';

passport.use(new Strategy(
  {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await UserModel
        .findOne({ email: payload.sub })
        .exec();

      done(undefined, user);
    } catch (err) {
      done(err);
    }
  },
));
