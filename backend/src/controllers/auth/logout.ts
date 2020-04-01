import { Request, Response } from 'express';

import { RefreshTokenModel } from '../../models/RefreshToken';

import { hashRefreshToken, unsetAccessRefreshTokens } from '../../utils/auth';

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies.refresh_token;

  if (refreshToken) {
    await RefreshTokenModel
      .deleteOne({ _id: hashRefreshToken(refreshToken) })
      .exec();
  }

  req.logout();
  unsetAccessRefreshTokens(res);

  res.redirect('/');
}
