import { DynamicModule, Module, Provider } from '@nestjs/common';

import { GCLOUD_STORAGE_BUCKET } from './gcloud-storage.constants';
import {
  GCloudStorageModuleAsyncOptions,
  GCloudStorageModuleOptions,
} from './gcloud-storage.interface';
import { GCloudStorageService } from './gcloud-storage.service';

@Module({})
export class GCloudStorageModule {
  static register(bucketName: GCloudStorageModuleOptions): DynamicModule {
    return {
      module: GCloudStorageModule,
      providers: [
        { provide: GCLOUD_STORAGE_BUCKET, useValue: bucketName },
        GCloudStorageService,
      ],
    };
  }

  static registerAsync(
    options: GCloudStorageModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GCloudStorageModule,
      providers: [
        this.createAsyncOptionsProviders(options),
        GCloudStorageService,
      ],
    };
  }

  private static createAsyncOptionsProviders(
    options: GCloudStorageModuleAsyncOptions,
  ): Provider {
    return {
      provide: GCLOUD_STORAGE_BUCKET,
      useFactory: options.useFactory,
    };
  }
}
