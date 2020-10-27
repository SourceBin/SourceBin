import crypto from 'crypto';
import { Storage } from '@google-cloud/storage';

import { days } from './time';

import { File, Bin, BinModel } from '../models/Bin';

const storage = new Storage();
const cdn = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '');

function generateKey(): Promise<string> {
  return new Promise((res, rej) => {
    crypto.randomBytes(5, (err, buffer) => {
      if (err) {
        rej(err);
      } else {
        res(buffer.toString('hex'));
      }
    });
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
