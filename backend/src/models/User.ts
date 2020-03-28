import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string;
  username: string;

  oauth: {
    discord?: string;
    github?: string;
  };
}

const userSchema = new mongoose.Schema({
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
});

export const UserModel = mongoose.model<User>('User', userSchema);
