import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { replyError } from '../utils/errors';

const parser = bodyParser.json();

export function jsonParser(req: Request, res: Response, next: NextFunction): void {
  parser(req, res, (err) => {
    if (err) {
      replyError(400, 'Invalid request data', res);
    } else {
      next();
    }
  });
}
