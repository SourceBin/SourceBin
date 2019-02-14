const fs = require('fs');

if (!fs.existsSync('config.json')) {
  fs.writeFileSync('config.json', JSON.stringify({
    database: 'mongodb uri',
    oauth2: {
      uri: 'https://discordapp.com/api/oauth2/authorize?' +
        'client_id=some_id&redirect_uri=some_redirect&response_type=code&scope=identify',
      client_secret: 'some_secret',
    },
  }, null, 2));
}
