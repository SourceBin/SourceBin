import { Request, Response } from 'express';

export function getUser(req: Request, res: Response): void {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  res.json({
    email: req.user.email,
    username: req.user.username,
    oauth: {
      discord: req.user.oauth.discord,
      github: req.user.oauth.github,
    },
  });
}
