import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { User } from '../../../schemas/user.schema';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies.access_token,
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    const isExpired = payload.exp * 1000 - Date.now() < 0;
    if (!isExpired) {
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Unknown user');
      }

      return user;
    }

    if (!req.res) {
      throw new UnauthorizedException('Authentication failed');
    }

    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      this.authService.unsetAccessRefreshToken(req.res);
      throw new UnauthorizedException('Expired access token');
    }

    const token = await this.authService.findRefreshToken(refreshToken);
    if (token && token.user._id === payload.sub) {
      await this.authService.setNewAccessRefreshToken(req.res, token.user);
      return token.user;
    }

    this.authService.unsetAccessRefreshToken(req.res);
    throw new UnauthorizedException('Invalid refresh token');
  }
}
