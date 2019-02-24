const { performance: { now } } = require('perf_hooks');

module.exports = (route, ctx) => {
  route.afterEach((request, reply) => {
    ctx.log(
      `${new Date().toLocaleString('uk')} | ` +
      `${reply.getCode()} | ` +
      `${now() - request.start}ms | ` +
      `${request.method.toUpperCase()} /${request.path}`
    );
  });
};
