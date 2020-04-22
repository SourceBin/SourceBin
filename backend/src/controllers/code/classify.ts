import { Request, Response } from 'express';
import Joi from '@hapi/joi';
import axios from 'axios';

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
    const { data } = await axios.post(`http://${process.env.GENUS_CODICE_URL}/classify`, req.body);
    res.json(data);
  } catch {
    replyError(500, 'Failed to classify code', res);
  }
}
