const mongoose = require('mongoose');

const Model = new mongoose.Schema({
  key: String,
  code: String,
  created: { type: Date, default: new Date() },
});
module.exports = mongoose.model('code', Model);
