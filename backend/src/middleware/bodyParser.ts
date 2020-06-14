import {
  Request, Response, NextFunction, RequestHandler,
} from 'express';
import bodyParser from 'body-parser';

import { replyError } from '../utils/errors';

const json = bodyParser.json();

function parse(parser: RequestHandler, req: Request, res: Response, next: NextFunction): void {
  parser(req, res, (err) => {
    if (err) {
      replyError(400, 'Invalid request data', res);
    } else {
      next();
    }
  });
}

export function jsonParser(req: Request, res: Response, next: NextFunction): void {
  parse(json, req, res, next);
}

export function jsonParserProLimit(
  freeLimit: string | number,
  proLimit: string | number,
): RequestHandler {
  const freeJson = bodyParser.json({ limit: freeLimit });
  const proJson = bodyParser.json({ limit: proLimit });

  return (req, res, next) => {
    if (req.user && req.user.plan === 'Pro') {
      parse(proJson, req, res, next);
    } else {
      parse(freeJson, req, res, next);
    }
  };
}
