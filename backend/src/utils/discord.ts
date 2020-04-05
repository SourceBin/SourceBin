import { Strategy } from 'passport-discord';

const BASE_URL = 'https://cdn.discordapp.com';

export function getAvatarURL(profile: Strategy.Profile): string {
  if (profile.avatar) {
    const ext = profile.avatar.startsWith('a_') ? 'gif' : 'png';
    return `${BASE_URL}/avatars/${profile.id}/${profile.avatar}.${ext}`;
  }

  return `${BASE_URL}/embed/avatars/${Number(profile.discriminator) % 5}.png`;
}
