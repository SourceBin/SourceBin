import { Request, Response } from 'express';

import { Bin } from '../../models/Bin';

import { error } from '../../utils/errors';

export async function getBin(req: Request, res: Response): Promise<void> {
  const { key } = req.params;

  const bin = await Bin
    .findOne({ key })
    .select('-_id key content languageId created')
    .exec();

  if (bin) {
    res.json(bin);
  } else {
    error(404, 'Bin not found', res);
  }
}
