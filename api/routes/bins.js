const { Bin } = require('utils');

module.exports = (route, ctx) => {
  route({
    method: 'GET',
    path: /^bin\/([a-f0-9]{10})$/,
    middleware: [ctx.limiters.rawBin],
    async handler(request, reply) {
      const bin = await ctx.models.Bin
        .findOne({ key: request.matches[1] })
        .select('-__v -_id')
        .exec();

      if (bin) {
        reply.json(bin);
      } else {
        reply.code(404).json({ error: 'Bin not found' });
      }
    },
  });

  route({
    method: 'POST',
    path: '/bin',
    middleware: [ctx.limiters.createBin],
    async handler(request, reply) {
      const { valid, error } = Bin.isValid(request.body);

      if (!valid) {
        reply.code(400).json({ error });
        return;
      }

      const key = Bin.generateKey();
      await new ctx.models.Bin({ key, code: request.body }).save();

      reply.json({ key });
    },
  });
};
