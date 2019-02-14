const mongoose = require('mongoose');

const Model = new mongoose.Schema({
  id: String,
  key: String,
  code: String,
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model('bin', Model);
