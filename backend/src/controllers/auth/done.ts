import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../../models/User';

export function done(req: Request, res: Response): void {
  const user = req.user as User;

  const token = jwt.sign(
    { sub: user.email },
    process.env.JWT_SECRET || '',
  );

  res.cookie('jwt', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(2147483647000), // Tue, 19 Jan 2038 03:14:07 GMT
  });

  res.redirect('/account');
}
