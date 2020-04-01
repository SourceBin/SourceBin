import passport from 'passport';
import { Strategy } from 'passport-discord';

import { createOrGetUser } from '../utils/auth';

passport.use(new Strategy(
  {
    clientID: process.env.DISCORD_OAUTH_ID || '',
    clientSecret: process.env.DISCORD_OAUTH_SECRET || '',
    callbackURL: process.env.DISCORD_OAUTH_CALLBACK_URL || '',
    scope: ['identify', 'email'],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const user = await createOrGetUser(
        { 'oauth.discord': profile.id },
        {
          email: profile.email as string,
          username: profile.username,
          'oauth.discord': profile.id,
        },
      );

      done(undefined, user);
    } catch {
      done(undefined, undefined, { error: 'Email is already used' });
    }
  },
));
