module.exports = router => {
  function route(options) {
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
  }

  route.beforeEach = callback => {
    router.beforeEach(callback);
    return route;
  };

  route.afterEach = callback => {
    router.afterEach(callback);
    return route;
  };

  route.on404 = callback => {
    router.on404(callback);
    return route;
  };

  return route;
};
