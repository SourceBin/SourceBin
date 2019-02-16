/**
 * Distributed under the ISC license:
 *
 * Copyright 2018 SebastiaanYN
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 *
 */

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

if (cluster.isMaster) {
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
