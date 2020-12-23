import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../schemas/refreshtoken.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { DiscordStrategy } from './strategy/discord.strategy';
import { GitHubStrategy } from './strategy/github.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UserModule,
  ],
  providers: [
    AuthService,
    AnonymousStrategy,
    DiscordStrategy,
    GitHubStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
