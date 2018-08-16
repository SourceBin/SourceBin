const mongoose = require('mongoose');

const Model = new mongoose.Schema({
  ip: String,
  created: { type: Date, default: new Date() },
});
module.exports = mongoose.model('ban', Model);
