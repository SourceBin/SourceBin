import { User, UserModel } from '../models/User';

type UserData = Pick<User, 'email' | 'username' | 'oauth'>;

export function upsertUser(user: UserData): Promise<User> {
  return UserModel
    .findOneAndUpdate(
      { email: user.email },
      user,
      { upsert: true, new: true, runValidators: true },
    )
    .exec();
}
