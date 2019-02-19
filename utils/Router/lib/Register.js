// eslint-disable-next-line arrow-body-style
module.exports = router => {
  return function register(name, value) {
    if (router._ctx[name]) {
      throw new Error(`plugin "${name}" already exists`);
    }

    router._ctx[name] = value;
  };
};
