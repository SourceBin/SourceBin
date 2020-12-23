import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bin, BinDocument } from '../../schemas/bin.schema';
import { OAuth, User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Bin.name) private readonly binModel: Model<BinDocument>,
  ) {}

  findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async getOrCreate(oauth: OAuth, data: any): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate(
      { oauth },
      { 'about.avatarURL': data.about.avatarURL }, // TODO: have an image CDN so avatars stay valid
      { new: true },
    );

    if (user) {
      return user;
    } else {
      return this.userModel.create(data);
    }
  }

  findBins(user: User): Promise<BinDocument[]> {
    return this.binModel
      .find({ owner: user })
      .select('-_id key title description hits files.languageId created')
      .exec();
  }
}
