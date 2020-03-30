import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

export async function listBins(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  const bins = await BinModel
    .find({ owner: req.user._id })
    .select('-_id key')
    .exec();

  res.json({ bins: bins.map(bin => bin.key) });
}
