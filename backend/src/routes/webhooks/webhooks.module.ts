import { Module } from '@nestjs/common';

import { StripeModule } from '../../libs/stripe';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [StripeModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
