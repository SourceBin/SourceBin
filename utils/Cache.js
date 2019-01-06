/**
 * Shorthand class that creates a cache system which stores data for x seconds
 */
class CacheMap extends Map {
  /**
   * Create a new CacheMap object
   * @param {Number} interval The time between clearing the cache (in milliseconds), if 0 or less cache will never clear
   */
  constructor(interval = 0) {
    super();
    if (interval > 0) setInterval(() => this.clear(), interval);
  }
}

/**
 * Shorthand class that creates a cache system which stores data for x seconds
 */
class CacheSet extends Set {
  /**
   * Create a new CacheSet object
   * @param {Number} interval The time between clearing the cache (in milliseconds), if 0 or less cache will never clear
   */
  constructor(interval = 0) {
    super();
    if (interval > 0) setInterval(() => this.clear(), interval);
  }
}

module.exports = { CacheMap, CacheSet };
