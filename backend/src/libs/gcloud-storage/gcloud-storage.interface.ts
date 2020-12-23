export interface SaveMetadata {
  contentType?: string;
  cacheControl?: string;
}

export type GCloudStorageModuleOptions = string;

export interface GCloudStorageModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => GCloudStorageModuleOptions | Promise<GCloudStorageModuleOptions>;
}
