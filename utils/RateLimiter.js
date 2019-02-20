class RateLimiter {
  /**
   * @param {String} name The name of the ratelimiter
   * @param {RedisClient} redis The redis client to use
   * @param {Number} max The max amount of hits per timeWindow
   * @param {Number} timeWindow The time window for hits in milliseconds
   * @param {Function} onExceed Function to call when somebody hits a ratelimit
   */
  constructor(name, redis, max, timeWindow, onExceed) {
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
     * The max amount of hits per timeWindow
     * @type {Number}
     */
    this.max = max;

    /**
     * The time window for hits in milliseconds
     * @type {Number}
     */
    this.timeWindow = timeWindow;

    /**
     * Function to call when somebody hits a ratelimit
     * @type {Function}
     */
    this.onExceed = onExceed;
  }

  /**
   * Ratelimit a key
   * @param {*} key The key to ratelimit
   * @returns {Promise<Object>} Whether to limit the request
   */
  rateLimit(key) {
    return new Promise(res => {
      const time = Math.floor(Date.now() / this.timeWindow);
      const reset = (time + 1) * this.timeWindow;

      const requester = `${this.name}:${key}:${time}`;
      this.redis.get(requester, (err, hits) => {
        hits++;

        if (err) {
          console.error(err);
          res({ limit: true, remaining: 0, reset });
        }

        if (hits > this.max) {
          if (this.onExceed) this.onExceed(key);
          res({ limit: true, remaining: 0, reset });
        }

        this.redis.multi()
          .incr(requester)
          .expire(requester, this.timeWindow / 1000 * 2)
          .exec();

        res({ limit: false, remaining: this.max - hits, reset });
      });
    });
  }

  createChild(name, max, timeWindow, headers = false) {
    const limiter = new RateLimiter(name, this.redis, max, timeWindow, key => {
      this.rateLimit(key);
    });

    return async function limit(request, reply) {
      const response = await limiter.rateLimit(request.auth);

      if (headers) {
        reply.header('X-RateLimit-Limit', limiter.max);
        reply.header('X-RateLimit-Remaining', response.remaining);
        reply.header('X-RateLimit-Reset', response.reset);
      }

      if (response.limit) {
        if (headers) {
          reply.header('Retry-After', response.reset - Date.now());
        }

        reply.code(429).json({ error: 'Ratelimit exceeded' });
      }
    };
  }
}
module.exports = RateLimiter;
