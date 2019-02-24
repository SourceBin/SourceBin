module.exports = (route, ctx) => {
  route.on404((request, reply) => {
    ctx.log('404', `${request.method.toUpperCase()} /${request.path}`);

    reply
      .code(404)
      .html(`<h1>404 /${request.path} was not found</h1>`);
  });
};
