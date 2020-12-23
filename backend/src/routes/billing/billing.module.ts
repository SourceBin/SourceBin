import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StripeModule } from '../../libs/stripe';
import { User, UserSchema } from '../../schemas/user.schema';
import { BillingController } from './billing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    StripeModule,
  ],
  controllers: [BillingController],
})
export class BillingModule {}
