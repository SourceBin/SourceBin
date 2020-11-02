import mongoose from 'mongoose';

import { User } from './User';

export interface File extends mongoose.Document {
  name: string;
  languageId: number;
}

export interface Bin extends mongoose.Document {
  key: string;
  title?: string;
  description?: string;
  hits: number;
  owner?: User;
  files: File[];
  created: Date;
}

const binSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },

  title: String,
  description: String,

  hits: {
    type: Number,
    required: true,
    default: 0,
  },

  owner: {
    type: String,
    ref: 'User',
  },

  created: {
    type: Date,
    required: true,
    default: Date.now,
  },

  files: [{
    name: String,

    languageId: {
      type: Number,
      required: true,
    },

    _id: false,
  }],
});

export const BinModel = mongoose.model<Bin>('Bin', binSchema);
