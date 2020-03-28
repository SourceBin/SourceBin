import passport from 'passport';
import { Strategy } from 'passport-discord';

import { upsertUser } from '../utils/auth';

passport.use(new Strategy(
  {
    clientID: process.env.DISCORD_OAUTH_ID || '',
    clientSecret: process.env.DISCORD_OAUTH_SECRET || '',
    callbackURL: process.env.DISCORD_OAUTH_CALLBACK_URL || '',
    scope: ['identify', 'email'],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      if (typeof profile.email !== 'string') {
        throw new Error('Email must be a string');
      }

      const user = await upsertUser({
        email: profile.email,
        username: profile.username,
        'oauth.discord': true,
      });

      done(undefined, user);
    } catch (err) {
      done(err);
    }
  },
));
