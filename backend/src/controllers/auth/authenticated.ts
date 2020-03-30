import { Request, Response } from 'express';

import { setAccessRefreshTokens } from '../../utils/auth';

export async function authenticated(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  await setAccessRefreshTokens(res, req.user);
  res.redirect('/account');
}
