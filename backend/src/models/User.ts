import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string;
  username: string;

  oauth: {
    discord: boolean;
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
    discord: Boolean,
  },
});

export const UserModel = mongoose.model<User>('User', userSchema);
