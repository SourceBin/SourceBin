import { About, User } from '../../../schemas/user.schema';
import { BaseResponseDto } from '../../../utils/base-response.dto';

export class AboutResponseDto extends BaseResponseDto<AboutResponseDto> {
  readonly avatarURL?: string;
  readonly bio?: string;
  readonly website?: string;
  readonly location?: string;

  static fromDocument(about: About): AboutResponseDto {
    return new AboutResponseDto({
      avatarURL: about.avatarURL,
      bio: about.bio,
      website: about.webiste,
      location: about.location,
    });
  }
}

export class OauthResponseDto extends BaseResponseDto<OauthResponseDto> {
  readonly discord?: string;
  readonly github?: string;

  static fromDocument(oauth: OauthResponseDto): OauthResponseDto {
    return new OauthResponseDto({
      discord: oauth.discord,
      github: oauth.github,
    });
  }
}

export class UserResponseDto extends BaseResponseDto<UserResponseDto> {
  readonly username!: string;
  readonly about!: AboutResponseDto;
  readonly oauth!: OauthResponseDto;
  readonly createdAt!: Date;

  static fromDocument(user: User): UserResponseDto {
    return new UserResponseDto({
      username: user.username,
      about: AboutResponseDto.fromDocument(user.about),
      oauth: OauthResponseDto.fromDocument(user.oauth),
      createdAt: user.createdAt,
    });
  }
}
