import { Request, Response } from 'express';

import { BinModel } from '../../models/Bin';

import { replyError } from '../../utils/errors';

export async function getBin(req: Request, res: Response): Promise<void> {
  let select = '-_id key title description created files.name files.languageId';

  if (req.query.content !== 'false') {
    select += ' files.content';
  }

  const bin = await BinModel
    .findOne({ key: req.params.key })
    .select(select)
    .exec();

  if (bin) {
    res.json(bin);
  } else {
    replyError(404, 'Bin not found', res);
  }
}
