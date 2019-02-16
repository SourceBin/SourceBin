module.exports = router => {
  router.validateReq((_, __, data) => {
    data.auth = data.ip;
  });
};
