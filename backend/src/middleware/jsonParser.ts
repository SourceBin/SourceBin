import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { error } from '../utils/errors';

const parser = bodyParser.json();

export function jsonParser(req: Request, res: Response, next: NextFunction): void {
  parser(req, res, (err) => {
    if (err) {
      error(400, 'Invalid request data', res);
    } else {
      next();
    }
  });
}
