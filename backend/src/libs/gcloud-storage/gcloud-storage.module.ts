import { DynamicModule, Module } from '@nestjs/common';

import { GCloudStorageCoreModule } from './gcloud-storage-core.module';
import { GCloudStorageModuleAsyncOptions } from './gcloud-storage.interface';

@Module({})
export class GCloudStorageModule {
  static registerAsync(
    options: GCloudStorageModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GCloudStorageModule,
      imports: [GCloudStorageCoreModule.registerAsync(options)],
    };
  }
}
