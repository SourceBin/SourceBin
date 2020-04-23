import { Request, Response } from 'express';
import Joi from '@hapi/joi';

import { classifySnippets } from '../../utils/code';
import { replyError, replyJoiError } from '../../utils/errors';

const schema = Joi.array()
  .required()
  .length(1)
  .items(
    Joi.string().allow(''),
  );

export async function classify(req: Request, res: Response): Promise<void> {
  const { error } = schema.validate(req.body);

  if (error) {
    replyJoiError(error, res);
    return;
  }

  try {
    const languages = await classifySnippets(req.body);
    res.json(languages);
  } catch {
    replyError(500, 'Failed to classify code', res);
  }
}
