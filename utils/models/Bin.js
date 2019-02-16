module.exports = mongoose => {
  const Model = new mongoose.Schema({
    id: String,
    key: String,
    code: String,
    created: { type: Date, default: Date.now },
  });

  return mongoose.model('bin', Model);
};
