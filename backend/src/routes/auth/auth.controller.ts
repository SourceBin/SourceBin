import {
  Controller,
  Get,
  Next,
  Param,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { authenticate } from 'passport';

import { Cookie } from '../../decorators/cookie.decorator';
import { RateLimit } from '../../libs/rate-limiter';
import { minutes } from '../../utils/time.util';
import { AuthService } from './auth.service';

type AuthProvider = 'github' | 'discord';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':provider(github|discord)')
  @RateLimit({ every: minutes(1) })
  handleOauthRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('provider') provider: AuthProvider,
    @Query('redirect') redirect?: string,
  ): void {
    const state = {
      redirect,
    };

    const params = {
      session: false,
      state: Buffer.from(JSON.stringify(state)).toString('base64'),
    };

    authenticate(provider, params)(req, res, next);
  }

  @Get(':provider(github|discord)/callback')
  @RateLimit({ every: minutes(1) })
  handleOauthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('provider') provider: AuthProvider,
    @Query('state') state?: string,
  ): void {
    const params = { session: false };

    authenticate(provider, params, (err, user) => {
      if (err) {
        return this.authService.redirectError(res, err);
      }

      if (!user) {
        throw new UnauthorizedException();
      }

      this.authService.generateTokenAndRedirect(res, user, state);
    })(req, res, next);
  }

  @Get('logout')
  @Redirect('/')
  @RateLimit({ every: minutes(1) })
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Cookie('refresh_token') refreshToken?: string,
  ): Promise<void> {
    if (refreshToken) {
      await this.authService.deleteRefreshToken(refreshToken);
    }

    req.logout();
    this.authService.unsetAccessRefreshToken(res);
  }
}
