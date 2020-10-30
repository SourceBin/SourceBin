import { Storage } from '@google-cloud/storage';
import cryptoRandomString from 'crypto-random-string';

import { days } from './time';

import { File, Bin, BinModel } from '../models/Bin';

import * as config from '../config';

const storage = new Storage();
const cdn = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '');

function generateKey(): Promise<string> {
  return cryptoRandomString.async({
    length: config.bin.keyLength,
    type: 'alphanumeric',
  });
}

function saveFile(name: string, content: string): Promise<void> {
  return cdn.file(name).save(content, {
    metadata: {
      contentType: 'text/plain',
      cacheControl: `public, max-age=${days(1) / 1000}`,
    },
  });
}

export async function saveBin(opts: {
  title: string;
  description: string;
  ownerId: string | undefined;
  files: File[];
}): Promise<Bin> {
  const bin = await BinModel.create({
    key: await generateKey(),
    title: opts.title,
    description: opts.description,
    owner: opts.ownerId,
    files: opts.files,
  });

  await Promise.all(
    opts.files.map((file, i) => saveFile(`bins/${bin.key}/${i}`, file.content)),
  );

  return bin;
}
