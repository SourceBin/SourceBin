import { Injectable, NestMiddleware } from '@nestjs/common';
import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, next);
  }
}
