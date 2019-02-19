module.exports = register => {
  register('log', (...msg) => {
    console.log(`[${process.pid}]`, ...msg);
  });
};
