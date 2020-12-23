import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { User } from './user.schema';

@Schema({ _id: false })
export class File {
  @Prop()
  name?: string;

  @Prop({ required: true })
  languageId!: number;
}

@Schema()
export class Bin {
  @Prop({ unique: true, required: true })
  key!: string;

  @Prop()
  title?: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  hits!: number;

  @Prop({ type: String, ref: User.name })
  owner?: User;

  @Prop({ required: true, default: Date.now })
  created!: Date;

  @Prop([File])
  files!: File[];
}

export type BinDocument = Bin & Document;
export const BinSchema = SchemaFactory.createForClass(Bin);
