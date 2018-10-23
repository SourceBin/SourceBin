const { promisify } = require('./Methods.js');

class Database {
  constructor(model) {
    if (!model) throw new Error('model is required');
    this.model = model;

    /**
     * Find all database entries with this query
     * @param {Object} query The query to look for
     * @returns {Promise<Array<Object>>}
     */
    this.find = promisify(model.find.bind(model));

    /**
     * Find one database entry matching the query
     * @param {Object} query The query to look for
     * @returns {Promise<Object>}
     */
    this.findOne = promisify(model.findOne.bind(model));

    /**
     * Find one database entry matching the query and delete it
     * @param {Object} query The query to look for
     * @returns {Promise<Object>}
     */
    this.findOneAndDelete = promisify(model.findOneAndDelete.bind(model));
  }

  /**
   * Create a new document
   * @param {Object} data The data to pass into the document
   * @returns {Promise<Object>}
   */
  async createDocument(data) {
    const model = new this.model(data);
    await model.save();
    return model;
  }
}
module.exports = Database;
