import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { REFRESH_TOKEN_TTL } from '../configs/auth.config';
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
    expires: REFRESH_TOKEN_TTL / 1000,
  })
  createdAt!: Date;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
