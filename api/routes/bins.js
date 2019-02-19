const { Methods } = require('utils');

module.exports = (route, ctx) => {
  route({
    method: 'GET',
    path: /^bin\/([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/,
    middleware: [ctx.limiters.rawBin],
    async handler(request, reply) {
      const bin = await ctx.models.Bin
        .findOne({ key: request.matches[1] })
        .select('-__v -_id')
        .exec();

      reply.json(bin);
    },
  });

  route({
    method: 'POST',
    path: '/bin',
    middleware: [ctx.limiters.createBin],
    async handler(request, reply) {
      let error = null;

      if (typeof request.body !== 'string') error = 'Expected a string';
      else if (!request.body.length) error = 'Can\'t save an empty string';
      else if (request.body.length > 100000) error = 'String is too long, max 100.000';

      if (error) {
        reply.code(400).json({ error });
        return;
      }

      const key = Methods.generateKey();
      await new ctx.models.Bin({ key, code: request.body }).save();

      reply.json({ key });
    },
  });
};
