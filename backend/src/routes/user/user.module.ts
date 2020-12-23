import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Bin, BinSchema } from '../../schemas/bin.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Bin.name, schema: BinSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
