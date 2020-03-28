import { User, UserModel } from '../models/User';

export async function createOrGetUser(conditions: any, data: any): Promise<User> {
  const user = await UserModel.findOne(conditions);

  if (user) {
    return user;
  }

  return UserModel.create(data);
}
