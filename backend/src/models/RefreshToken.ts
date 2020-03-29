import mongoose from 'mongoose';

import { User } from './User';

import * as config from '../config';

export interface RefreshToken extends mongoose.Document {
  token: string;
  user: User;
  createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: {
    type: Date,
    expires: config.auth.refreshTokenTTL / 1000,
    default: Date.now,
  },
});

export const RefreshTokenModel = mongoose.model<RefreshToken>('RefreshToken', refreshTokenSchema);
