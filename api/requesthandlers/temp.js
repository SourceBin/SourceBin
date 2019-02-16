module.exports = router => {
  router.get('/', res => {
    res.html(200, 'api');
  });

  router.get('/me', (res, data) => {
    res.json(200, data);
  });
};
