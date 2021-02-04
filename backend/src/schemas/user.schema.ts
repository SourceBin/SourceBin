import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uuid from 'uuid';

export class About {
  @Prop()
  avatarURL?: string;

  @Prop()
  bio?: string;

  @Prop()
  webiste?: string;

  @Prop()
  location?: string;
}

export class OAuth {
  @Prop()
  discord?: string;

  @Prop()
  github?: string;
}

@Schema()
export class User {
  @Prop({ required: true, default: uuid.v4 })
  _id!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  username!: string;

  @Prop()
  about!: About;

  @Prop()
  oauth!: OAuth;

  @Prop({ required: true, default: Date.now })
  createdAt!: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
