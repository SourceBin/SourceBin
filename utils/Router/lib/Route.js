// eslint-disable-next-line arrow-body-style
module.exports = router => {
  return function route(options) {
    if (
      !options.method ||
      !options.path ||
      !options.handler
    ) {
      throw new Error('Missing method, path and/or handler');
    }

    if (typeof options.path === 'string') {
      options.path = options.path.replace(/^\/+|\/+$/g, '');
    }

    router._routes.push({
      method: options.method.toLowerCase(),
      path: options.path,
      middleware: options.middleware,
      handler: options.handler,
    });
  };
};
