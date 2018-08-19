class RateLimiter {

  /**
   * @param {Number} max The max amount of hits per windowMs
   * @param {Number} windowMs The time window for hits in milliseconds
   * @param {Function} onExceed Function to call when somebody hits a ratelimit
   */
  constructor(max, windowMs, onExceed) {
    /**
     * The max amount of hits per windowMs
     * @type {Number}
     */
    this.max = max;

    /**
     * The time window for hits in milliseconds
     * @type {Number}
     */
    this.windowMs = windowMs;

    /**
     * Function to call when somebody hits a ratelimit
     * @type {Function}
     */
    this.onExceed = onExceed;

    /**
     * Hits stored by key
     * @type {Map<*, Array<Date>>}
     */
    this.hits = new Map();

    setInterval(() => {
      for (const [key, dates] of this.hits) {
        const filtered = dates.filter(date => date < new Date());
        if (filtered) this.hits.set(key, filtered);
        else this.hits.delete(key);
      }
    }, 1000 * 60 * 60);
  }

  /**
   * Ratelimit a key
   * @param {*} key The key to ratelimit
   * @returns {Boolean} Whether to limit the request
   */
  rateLimit(key) {
    const now = new Date();
    const dates = this.hits.get(key) || [];
    if (dates.length === this.max) {
      if (dates[0] > now) {
        if (this.onExceed) this.onExceed(key);
        return true;
      } else dates.shift();
    }
    dates.push(now.getTime() + this.windowMs);
    this.hits.set(key, dates);
    return false;
  }

  /**
   * The middleware function for the router
   * @returns {Function}
   */
  get middleware() {
    const $this = this;

    function limit(res, data, next) {
      const limit = $this.rateLimit(data.ip);
      if (limit) return res.json(429, { error: 'Ratelimit exceeded' });
      else return next();
    }
    return limit;
  }
}
module.exports = RateLimiter;
