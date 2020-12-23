import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';

import { AuthConfig } from '../../../configs';
import { User } from '../../../schemas/user.schema';
import { UserService } from '../../user/user.service';

const BASE_URL = 'https://cdn.discordapp.com';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthConfig.KEY) authConfig: ConfigType<typeof AuthConfig>,
    private readonly userService: UserService,
  ) {
    super({
      clientID: authConfig.DISCORD.ID,
      clientSecret: authConfig.DISCORD.SECRET,
      callbackURL: authConfig.DISCORD.CALLBACK_URL,
      scope: ['identify', 'email'],
    });
  }

  getAvatarURL(profile: Strategy.Profile): string {
    if (profile.avatar) {
      const ext = profile.avatar.startsWith('a_') ? 'gif' : 'png';
      return `${BASE_URL}/avatars/${profile.id}/${profile.avatar}.${ext}`;
    }

    return `${BASE_URL}/embed/avatars/${Number(profile.discriminator) % 5}.png`;
  }

  async validate(
    _accessToken: any,
    _refreshToken: any,
    profile: any,
  ): Promise<User> {
    try {
      return await this.userService.getOrCreate(
        { discord: profile.id },
        {
          email: profile.email,
          username: profile.username,

          about: {
            avatarURL: this.getAvatarURL(profile),
          },

          'oauth.discord': profile.id,
        },
      );
    } catch {
      throw new UnauthorizedException('Email is already used');
    }
  }
}
