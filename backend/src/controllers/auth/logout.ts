import { Request, Response } from 'express';

import { RefreshTokenModel } from '../../models/RefreshToken';

import { unsetAccessRefreshTokens } from '../../utils/auth';

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    await RefreshTokenModel
      .deleteOne({ token: refreshToken })
      .exec();
  }

  req.logout();
  unsetAccessRefreshTokens(res);

  res.redirect('/');
}
