import { User, UserModel } from '../models/User';

export function upsertUser(user: any): Promise<User> {
  return UserModel
    .findOneAndUpdate(
      { email: user.email },
      user,
      { upsert: true, new: true, runValidators: true },
    )
    .exec();
}
