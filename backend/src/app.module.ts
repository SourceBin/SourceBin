import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';

import { AppController } from './app.controller';
import { AuthConfig, DatabaseConfig, StripeConfig } from './configs';
import { CodeModule } from './libs/code';
import { GCloudStorageModule } from './libs/gcloud-storage';
import { RateLimiterModule } from './libs/rate-limiter';
import { JsonBodyMiddleware } from './middleware/json-body.middleware';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';
import { AuthModule } from './routes/auth/auth.module';
import { BillingModule } from './routes/billing/billing.module';
import { BinsModule } from './routes/bins/bins.module';
import { UserModule } from './routes/user/user.module';
import { WebhooksModule } from './routes/webhooks/webhooks.module';
import { User } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [AuthConfig, DatabaseConfig, StripeConfig],
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
    BillingModule,
    WebhooksModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'webhooks/stripe', method: RequestMethod.POST })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
