const { Methods } = require('utils');

module.exports = (route, ctx) => {
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

  route({
    method: 'GET',
    path: '/list',
    middleware: [ctx.limiters.list],
    async handler(_, reply) {
      const bin = await ctx.models.Bin.find().select('key -_id').exec();
      reply.json(bin.map(bin => bin.key));
    },
  });
};
