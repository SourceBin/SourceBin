class Database {
  constructor(model) {
    if (!model) throw new Error('model is required');
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data The data to pass into the document
   * @returns {Promise<Object>}
   */
  async createDocument(data) {
    let model = new this.model(data);
    model = await model.save();
    return model;
  }
}
module.exports = Database;
