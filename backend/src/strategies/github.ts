import passport from 'passport';
import { Strategy } from 'passport-github2';

import { upsertUser } from '../utils/auth';

passport.use(new Strategy(
  {
    clientID: process.env.GITHUB_OAUTH_ID || '',
    clientSecret: process.env.GITHUB_OAUTH_SECRET || '',
    callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL || '',
    scope: ['user:email'],
  },
  async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
    try {
      const user = await upsertUser({
        email: profile.emails[0].value,
        username: profile.username,
        'oauth.github': true,
      });

      done(undefined, user);
    } catch (err) {
      done(err);
    }
  },
));
