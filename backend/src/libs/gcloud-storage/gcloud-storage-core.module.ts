import { DynamicModule, Global, Module } from '@nestjs/common';

import { GCLOUD_STORAGE_CONFIG } from './gcloud-storage.constants';
import { GCloudStorageModuleAsyncOptions } from './gcloud-storage.interface';
import { GCloudStorageService } from './gcloud-storage.service';

@Global()
@Module({
  providers: [GCloudStorageService],
  exports: [GCloudStorageService],
})
export class GCloudStorageCoreModule {
  static registerAsync(
    options: GCloudStorageModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GCloudStorageCoreModule,
      imports: options.imports,
      providers: [
        {
          provide: GCLOUD_STORAGE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: GCloudStorageService,
          useFactory: (options: string) => new GCloudStorageService(options),
          inject: [GCLOUD_STORAGE_CONFIG],
        },
      ],
      exports: [GCloudStorageService],
    };
  }
}
