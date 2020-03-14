import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

import { replyError } from '../../utils/errors';

export async function getBin(req: Request, res: Response): Promise<void> {
  const bin = await BinModel
    .findOne({ key: req.params.key })
    .select('-_id key files created')
    .exec();

  if (bin) {
    res.json(bin);
  } else {
    replyError(404, 'Bin not found', res);
  }
}
