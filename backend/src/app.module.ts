import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nest-redis';

import { AppController } from './app.controller';
import { AuthConfig, DatabaseConfig } from './configs';
import { CodeModule } from './libs/code';
import { GCloudStorageModule } from './libs/gcloud-storage';
import { RateLimiterModule } from './libs/rate-limiter';
import { AuthModule } from './routes/auth/auth.module';
import { BinsModule } from './routes/bins/bins.module';
import { UserModule } from './routes/user/user.module';
import { User } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [AuthConfig, DatabaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('database.MONGODB_URI'),
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useCreateIndex: true,
        };
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('database.REDIS_URL'),
      }),
    }),
    RateLimiterModule.register({
      keyGenerator: (req) => (req.user as User | undefined)?._id ?? req.ip,
    }),
    GCloudStorageModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database.GCLOUD_BUCKET')!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }),
    HttpModule,
    BinsModule,
    AuthModule,
    UserModule,
    CodeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
