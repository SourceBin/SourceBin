import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

export async function getBins(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  const bins = await BinModel
    .find({ owner: req.user._id })
    .select('-_id key title description hits files.languageId created')
    .exec();

  res.json(bins);
}
