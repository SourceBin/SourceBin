import { Request, Response } from 'express';

import { loadExternal } from '../../utils/external';
import { error } from '../../utils/errors';

export async function getExternal(req: Request, res: Response): Promise<void> {
  const url = req.query.q;

  if (!url) {
    error(400, 'Missing resource url', res);
    return;
  }

  try {
    const result = await loadExternal(url);

    if (result.error) {
      error(400, result.content, res);
      return;
    }

    res.json({ content: result.content });
  } catch (err) {
    console.error(err);
    error(500, 'Error loading url', res);
  }
}
