/* global before after afterEach */

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let noConfig = false;
if (!fs.existsSync('./config.json')) {
  noConfig = true;
  console.log('- Creating config file');

  fs.writeFileSync('./config.json', JSON.stringify({
    database: 'database',
    oauth2: {
      uri: 'https://discordapp.com/api/oauth2/authorize?' +
        'client_id=some_id&redirect_uri=some_redirect&response_type=code&scope=identify',
      client_secret: 'IOqs1yeVN_6-dttt-tcTxdz0RW9qvybI',
    },
  }));
}

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

  if (noConfig) {
    fs.unlinkSync('./config.json');
    console.log('- Deleted config file');
  }
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});


fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.test.js'))
  .forEach(f => require(path.join(__dirname, f)));
