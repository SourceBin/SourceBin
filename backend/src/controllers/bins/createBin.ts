import { Request, Response } from 'express';
import Joi from '@hapi/joi';

import { BinModel } from '../../models/Bin';

import { generateKey } from '../../utils/bins';
import { replyError, replyJoiError } from '../../utils/errors';

import * as config from '../../config';

const schema = Joi.object({
  files: Joi.array()
    .min(1)
    .max(2) // TODO: check max amount of files based on user
    .required()
    .items({
      name: Joi.string()
        .max(config.bin.maxNameLength),

      content: Joi.string()
        .max(config.bin.maxContentLength)
        .required(),

      languageId: Joi.number()
        .integer()
        .positive()
        .required(),
    }),
});

export async function createBin(req: Request, res: Response): Promise<void> {
  const { error } = schema.validate(req.body);

  if (error) {
    replyJoiError(error, res);
    return;
  }

  try {
    const bin = await BinModel.create({
      key: await generateKey(),
      files: req.body.files,
    });

    res.json({ key: bin.key });
  } catch (err) {
    console.error(err);

    replyError(500, 'Error saving bin', res);
  }
}
