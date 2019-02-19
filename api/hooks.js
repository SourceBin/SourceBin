module.exports = router => {
  router.beforeEach(request => {
    request.auth = request.ip;
  });
};
