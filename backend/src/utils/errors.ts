import { Response } from 'express';
import Joi from '@hapi/joi';

export function replyError(code: number, message: string, res: Response): void {
  res.status(code).json({ message });
}

export function replyJoiError(err: Joi.ValidationError, res: Response): void {
  replyError(400, err.message, res);
}
