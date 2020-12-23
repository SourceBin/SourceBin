import { DynamicModule, Module } from '@nestjs/common';

import { GCLOUD_STORAGE_BUCKET } from './gcloud-storage.constants';
import { GCloudStorageService } from './gcloud-storage.service';

@Module({})
export class GCloudStorageModule {
  static register(bucketName: string): DynamicModule {
    return {
      module: GCloudStorageModule,
      providers: [
        { provide: GCLOUD_STORAGE_BUCKET, useValue: bucketName },
        GCloudStorageService,
      ],
    };
  }
}
