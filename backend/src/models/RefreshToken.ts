import mongoose from 'mongoose';

import { User } from './User';

import * as config from '../config';

export interface RefreshToken extends mongoose.Document {
  _id: string;
  user: User;
  createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  user: {
    type: String,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: config.auth.refreshTokenTTL / 1000,
  },
});

export const RefreshTokenModel = mongoose.model<RefreshToken>('RefreshToken', refreshTokenSchema);
