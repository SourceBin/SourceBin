import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

import { authConfig } from '../../../configs';
import { User } from '../../../schemas/user.schema';
import { UserService } from '../../user/user.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: authConfig.GITHUB.ID,
      clientSecret: authConfig.GITHUB.SECRET,
      callbackURL: authConfig.GITHUB.CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<User> {
    const info = profile._json;

    try {
      return await this.userService.getOrCreate(
        { github: profile.id },
        {
          email: profile.emails[0].value,
          username: profile.username,

          about: {
            avatarURL: info.avatar_url,
            bio: info.bio,
            website: info.blog,
            location: info.location,
          },

          'oauth.github': profile.id,
        },
      );
    } catch {
      throw new UnauthorizedException('Email is already used');
    }
  }
}
