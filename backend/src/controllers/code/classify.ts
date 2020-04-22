import { Request, Response } from 'express';
import Joi from '@hapi/joi';
import axios from 'axios';

import { replyJoiError } from '../../utils/errors';

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

  const { data } = await axios.post(`http://${process.env.GENUS_CODICE_URL}/classify`, req.body);
  res.json(data);
}
