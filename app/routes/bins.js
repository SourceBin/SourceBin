const { Bin } = require('utils');

module.exports = (route, ctx) => {
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
      let data = null;
      if (request.user.id) {
        data = { key, code: request.body, id: request.user.id };
      } else {
        data = { key, code: request.body };
      }
      await new ctx.models.Bin(data).save();

      reply.json({ key });
    },
  });

  route({
    method: 'DELETE',
    path: '/bin',
    middleware: [ctx.limiters.deleteBin],
    async handler(request, reply) {
      const bin = await ctx.models.Bin.findOneAndDelete({ key: request.body, id: request.user.id }).exec();

      if (bin) {
        reply.json({ message: 'Success' });
      } else {
        reply.code(400).json({ error: 'Bin does not exist, or you have no permission to delete it' });
      }
    },
  });
};
