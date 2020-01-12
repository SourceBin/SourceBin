import { Request, Response } from 'express';

import { Bin } from '../../models/Bin';

import { isValidContent, isValidLanguageId, generateKey } from '../../utils/bins';
import { error } from '../../utils/errors';

export async function createBin(req: Request, res: Response): Promise<void> {
  const { content, languageId } = req.body;

  if (!isValidContent(content)) {
    error(400, 'Content is invalid', res);
    return;
  }

  if (!isValidLanguageId(languageId)) {
    error(400, 'Language is invalid', res);
    return;
  }

  const key = generateKey();

  const bin = new Bin({
    key,
    content,
    languageId,
  });

  try {
    await bin.save();
    res.json({ key });
  } catch (err) {
    console.error(err);
    error(500, 'Error saving bin', res);
  }
}
