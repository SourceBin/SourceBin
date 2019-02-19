class RateLimiter {
  /**
   * @param {String} name The name of the ratelimiter
   * @param {RedisClient} redis The redis client to use
   * @param {Number} max The max amount of hits per windowMs
   * @param {Number} windowMs The time window for hits in milliseconds
   * @param {Function} onExceed Function to call when somebody hits a ratelimit
   */
  constructor(name, redis, max, windowMs, onExceed) {
    /**
     * The name of the ratelimiter
     * @type {String}
     */
    this.name = name;

    /**
     * The redis client to use
     * @type {RedisClient}
     */
    this.redis = redis;

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
  }

  /**
   * Ratelimit a key
   * @param {*} key The key to ratelimit
   * @returns {Promise<Boolean>} Whether to limit the request
   */
  rateLimit(key) {
    return new Promise(res => {
      const time = Math.floor(Date.now() / this.windowMs);
      const requester = `${this.name}:${key}:${time}`;

      this.redis.get(requester, (err, hits) => {
        if (err) {
          console.error(err);
          res(true);
        }

        if (hits > this.max) {
          if (this.onExceed) this.onExceed(key);
          res(true);
        }

        this.redis.multi()
          .incr(requester)
          .expire(requester, this.windowMs / 1000 * 2)
          .exec();

        res(false);
      });
    });
  }

  /**
   * The middleware function for the router
   * @returns {Function}
   */
  get middleware() {
    const $this = this;

    async function limit(request, reply) {
      const limit = await $this.rateLimit(request.auth);

      if (limit) {
        reply.code(429).json({ error: 'Ratelimit exceeded' });
      }
    }

    return limit;
  }
}
module.exports = RateLimiter;
