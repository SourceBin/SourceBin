import crypto from 'crypto';

export function generateKey(): Promise<string> {
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
