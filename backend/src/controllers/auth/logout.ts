import { Request, Response } from 'express';

import { unsetAccessRefreshTokens } from '../../utils/auth';

export function logout(req: Request, res: Response): void {
  req.logout();
  unsetAccessRefreshTokens(res);

  res.redirect('/');
}
