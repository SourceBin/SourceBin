import { Response } from 'express';

export function error(code: number, message: string, res: Response): void {
  res.status(code).json({
    status: 'error',
    message,
  });
}
