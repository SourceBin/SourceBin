const cluster = require('cluster');
const os = require('os');

function startServer() {
  const { Router } = require('utils');
  const router = new Router();
  require('./requesthandlers')(router);

  const mongoose = require('mongoose');
  const { database } = require('./config.json');
  mongoose.connect(database, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
      router.listen(process.env.PORT, () => console.log(`HTTP server listening on port ${process.env.PORT}`));
    })
    .catch(e => console.log(e));
}

function spawnWorker() {
  const worker = cluster.fork();
  worker.on('message', message => console.log(message));
}

if (false && cluster.isMaster) {
  console.log(`Master '${process.pid}' is running`);

  const cores = os.cpus().length;
  console.log(`Starting ${cores} workers`);
  for (let i = 0; i < cores; i++) {
    spawnWorker();
  }

  cluster.on('online', worker => console.log(`Worker '${worker.process.pid}' started`));

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker '${worker.process.pid}' died with code '${code}', and signal '${signal}'`);

    console.log('Starting a new worker');
    spawnWorker();
  });
} else {
  startServer();
}
