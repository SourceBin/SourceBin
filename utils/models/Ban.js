module.exports = mongoose => {
  const Model = new mongoose.Schema({
    ip: String,
    created: { type: Date, default: new Date() },
  });

  return mongoose.model('ban', Model);
};
