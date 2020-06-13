import { Request, Response } from 'express';

export function getUser(req: Request, res: Response): void {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  res.json({
    username: req.user.username,
    about: req.user.about,
    oauth: req.user.oauth,
    plan: req.user.plan,
    createdAt: req.user.createdAt,
  });
}
