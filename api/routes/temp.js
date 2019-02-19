module.exports = route => {
  route({
    method: 'GET',
    path: '/',
    handler(_, reply) {
      reply.html('api');
    },
  });

  route({
    method: 'GET',
    path: '/me',
    handler(request, reply) {
      delete request.raw;

      reply.json(request);
    },
  });
};
