import { ModuleMetadata } from '@nestjs/common';

export interface SaveMetadata {
  contentType?: string;
  cacheControl?: string;
}

export type GCloudStorageModuleOptions = string;

export interface GCloudStorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => GCloudStorageModuleOptions | Promise<GCloudStorageModuleOptions>;
  inject?: any[];
}
