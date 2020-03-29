import { Request, Response } from 'express';

import { User } from '../../models/User';

import { setAccessRefreshTokens } from '../../utils/auth';

export async function authenticated(req: Request, res: Response): Promise<void> {
  await setAccessRefreshTokens(res, req.user as User);

  res.redirect('/account');
}
