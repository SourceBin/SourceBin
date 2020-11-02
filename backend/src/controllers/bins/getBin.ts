import { Request, Response } from 'express';

import { loadBin } from '../../utils/bins';
import { replyError } from '../../utils/errors';

export async function getBin(req: Request, res: Response): Promise<void> {
  const bin = await loadBin(
    req.params.key,
    'key title description hits created files.name files.languageId',
    req.user ? req.user._id : req.ip,
  );

  if (bin) {
    res.json(bin);
  } else {
    replyError(404, 'Bin not found', res);
  }
}
