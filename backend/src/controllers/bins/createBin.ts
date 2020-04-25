import { Request, Response } from 'express';
import Joi from '@hapi/joi';

import { BinModel } from '../../models/Bin';

import { generateKey } from '../../utils/bins';
import { classifySnippets } from '../../utils/code';
import { replyError, replyJoiError } from '../../utils/errors';

import * as config from '../../config';

const schema = Joi.object({
  files: Joi.array()
    .length(1)
    .required()
    .items({
      name: Joi.string()
        .max(config.bin.maxNameLength),

      content: Joi.string()
        .max(config.bin.maxContentLength)
        .required(),

      languageId: Joi.number()
        .integer()
        .positive(),
    }),
});

export async function createBin(req: Request, res: Response): Promise<void> {
  const { error } = schema.validate(req.body);

  if (error) {
    replyJoiError(error, res);
    return;
  }

  try {
    const files: any[] = req.body.files.filter((file: any) => file.languageId === undefined);
    const languages = await classifySnippets(files.map((file: any) => file.content));

    for (let i = 0; i < files.length; i += 1) {
      files[i].languageId = languages[i];
    }
  } catch {
    replyError(500, 'Failed to classify languages', res);
  }

  try {
    const bin = await BinModel.create({
      key: await generateKey(),
      owner: req.user
        ? req.user._id
        : undefined,
      files: req.body.files,
    });

    res.json({
      key: bin.key,
      languages: bin.files.map(file => file.languageId),
    });
  } catch (err) {
    console.error(err);

    replyError(500, 'Error saving bin', res);
  }
}
