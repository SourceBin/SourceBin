import { Request, Response } from 'express';

import { Bin } from '../../models/Bin';

import { isValid, generateKey } from '../../utils/bins';
import { error } from '../../utils/errors';

export async function createBin(req: Request, res: Response): Promise<void> {
  const { content } = req.body;

  if (!isValid(content)) {
    error(400, 'Content is invalid', res);
    return;
  }

  const key = generateKey();

  const bin = new Bin({
    key,
    content,
  });

  try {
    await bin.save();
    res.json({ key });
  } catch (err) {
    console.error(err);
    error(500, 'Error saving bin', res);
  }
}
