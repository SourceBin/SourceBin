import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

import { replyError } from '../../utils/errors';

export async function getRaw(req: Request, res: Response): Promise<void> {
  const bin = await BinModel
    .findOne({ key: req.params.key })
    .select('-_id files.content')
    .exec();

  if (!bin) {
    replyError(404, 'Bin not found', res);
    return;
  }

  const fileIndex = Number(req.params.fileIndex);
  const file = bin.files[fileIndex];

  if (file) {
    res.set('Content-Type', 'text/plain');
    res.send(file.content);
  } else {
    replyError(404, 'File not found', res);
  }
}
