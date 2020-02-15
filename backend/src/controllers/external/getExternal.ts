import { Request, Response } from 'express';

import { loadExternal } from '../../utils/external';
import { error } from '../../utils/errors';

export async function getExternal(req: Request, res: Response): Promise<void> {
  const url = req.query.q;

  if (!url) {
    error(400, 'Missing resource url', res);
  }

  try {
    const content = await loadExternal(url);

    res.json({ content });
  } catch (err) {
    console.error(err);
    error(500, 'Error loading url', res);
  }
}
