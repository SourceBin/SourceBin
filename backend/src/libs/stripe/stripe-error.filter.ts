import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import Stripe from 'stripe';

@Catch(Stripe.errors.StripeError)
export class StripeErrorFilter implements ExceptionFilter {
  catch(err: Stripe.StripeError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    res.status(err.statusCode ?? 400).json({ message: err.message });
  }
}
