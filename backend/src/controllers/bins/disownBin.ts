import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

import { replyError } from '../../utils/errors';

export async function disownBin(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  const result = await BinModel
    .updateOne(
      {
        key: req.params.key,
        owner: req.user._id,
      },
      { $unset: { owner: true } },
    )
    .exec();

  if (result.n) {
    res.json({ success: true });
  } else {
    replyError(404, 'Bin not found or not owned by you', res);
  }
}
