import { Injectable, NestMiddleware } from '@nestjs/common';
import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.raw({ type: '*/*' })(req, res, next);
  }
}
