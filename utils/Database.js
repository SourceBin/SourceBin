const { promisify } = require('./Methods.js');

class Database {
  constructor(model) {
    if (!model) model = require('../model.js');
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
  }

  /**
   * Create a new model
   * @param {Object} data The data to pass into the model
   * @returns {Object}
   */
  createModel(data) {
    const model = new this.model(data);
    return model.save();
  }
}
module.exports = Database;
