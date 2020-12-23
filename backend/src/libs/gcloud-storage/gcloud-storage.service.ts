import { Bucket, Storage } from '@google-cloud/storage';
import { Inject, Injectable } from '@nestjs/common';

import { GCLOUD_STORAGE_BUCKET } from './gcloud-storage.constants';
import { SaveMetadata } from './gcloud-storage.interface';

@Injectable()
export class GCloudStorageService {
  readonly storage = new Storage();
  readonly bucket: Bucket;

  constructor(@Inject(GCLOUD_STORAGE_BUCKET) bucketName: string) {
    this.bucket = this.storage.bucket(bucketName);
  }

  saveFile(
    filename: string,
    data: any,
    metadata?: SaveMetadata,
  ): Promise<void> {
    return this.bucket.file(filename).save(data, { metadata });
  }
}
