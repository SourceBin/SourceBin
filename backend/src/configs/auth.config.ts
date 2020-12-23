import { asString } from '../utils/asserts.util';
import { minutes, weeks } from '../utils/time.util';

export const ACCESS_TOKEN_TTL = minutes(15);
export const REFRESH_TOKEN_TTL = weeks(4);

export const JWT_SECRET = asString(process.env.JWT_SECRET);

export const DISCORD = {
  ID: asString(process.env.DISCORD_OAUTH_ID),
  SECRET: asString(process.env.DISCORD_OAUTH_SECRET),
  CALLBACK_URL: asString(process.env.DISCORD_OAUTH_CALLBACK_URL),
};

export const GITHUB = {
  ID: asString(process.env.GITHUB_OAUTH_ID),
  SECRET: asString(process.env.GITHUB_OAUTH_SECRET),
  CALLBACK_URL: asString(process.env.GITHUB_OAUTH_CALLBACK_URL),
};
