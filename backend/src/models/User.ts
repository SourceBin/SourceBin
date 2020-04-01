import mongoose from 'mongoose';
import * as uuid from 'uuid';

export interface User extends mongoose.Document {
  _id: string;
  email: string;
  username: string;

  oauth: {
    discord?: string;
    github?: string;
  };
}

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuid.v4,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  oauth: {
    discord: String,
    github: String,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const UserModel = mongoose.model<User>('User', userSchema);
