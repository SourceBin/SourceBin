const mongoose = require('mongoose');

const { Router } = require('utils');
const router = new Router();

router.register('./plugins/');
router.load('./hooks/');
router.load('./routes/');

const { database } = require('./config.json');
mongoose.connect(database, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    router.listen(process.env.PORT, {
      instances: require('os').cpus().length,
      callback: () => console.log(`Listening on port ${process.env.PORT}`),
    });
  })
  .catch(e => console.log(e));
