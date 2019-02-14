const { Database } = require('../../utils');

module.exports = {
  bans: new Database(require('../../models/Ban.js')),
  bins: new Database(require('../../models/Bin.js')),
};
