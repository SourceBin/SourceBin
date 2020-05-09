import mongoose from 'mongoose';
import * as uuid from 'uuid';

export interface User extends mongoose.Document {
  _id: string;
  email: string;
  username: string;

  about: {
    avatarURL?: string;
    bio?: string;
    website?: string;
    location?: string;
  };

  oauth: {
    discord?: string;
    github?: string;
  };

  subscription: {
    stripeId?: string;
    plan: 'Free' | 'Pro';
  };

  createdAt: Date;
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

  about: {
    avatarURL: String,
    bio: String,
    website: String,
    location: String,
  },

  oauth: {
    discord: String,
    github: String,
  },

  subscription: {
    stripeId: String,
    plan: {
      type: String,
      enum: ['Free', 'Pro'],
      required: true,
      default: 'Free',
    },
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const UserModel = mongoose.model<User>('User', userSchema);
