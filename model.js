const mongoose = require('mongoose');

const CodeModel = new mongoose.Schema({
  key: String,
  code: String,
  created: { type: Date, default: new Date() },
});
module.exports = mongoose.model('code', CodeModel);
