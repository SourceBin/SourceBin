import { Request, Response } from 'express';

export function logout(req: Request, res: Response): void {
  req.logout();

  res.clearCookie('jwt', {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });

  res.redirect('/');
}
