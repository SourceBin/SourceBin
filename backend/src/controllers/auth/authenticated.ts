import { Request, Response } from 'express';
import { parse } from 'url';

import { setAccessRefreshTokens } from '../../utils/auth';

function extractRedirect(state: string): string | null {
  const { redirect } = JSON.parse(Buffer.from(state, 'base64').toString());

  if (redirect) {
    try {
      return parse(redirect).path;
    } catch {
      return null;
    }
  }

  return null;
}

export async function authenticated(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  await setAccessRefreshTokens(res, req.user);

  const { state } = req.query;

  if (state) {
    const redirect = extractRedirect(state);

    if (redirect) {
      res.redirect(redirect);
      return;
    }
  }

  res.redirect('/account');
}
