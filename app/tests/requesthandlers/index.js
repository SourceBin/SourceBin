/* global before after afterEach */

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
before(function(done) {
  this.timeout(10 * 60 * 1000);

  mongoServer = new MongoMemoryServer();
  mongoServer.getConnectionString()
    .then(mongoUri => mongoose
      .connect(mongoUri, { useNewUrlParser: true })
      .catch(e => done(e)))
    .then(() => {
      console.log('- MongoDB Connected\n\n');
      done();
    });
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
  console.log('\n- MongoDB Disconnected');
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});


fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.test.js'))
  .forEach(f => require(path.join(__dirname, f)));
