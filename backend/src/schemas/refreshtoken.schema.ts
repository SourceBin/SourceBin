import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { authConfig } from '../configs';
import { User } from './user.schema';

@Schema()
export class RefreshToken {
  @Prop({ required: true })
  _id!: string;

  @Prop({
    type: String,
    ref: User.name,
    required: true,
  })
  user!: User;

  @Prop({
    required: true,
    default: Date.now,
    expires: authConfig.REFRESH_TOKEN_TTL / 1000,
  })
  createdAt!: Date;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
