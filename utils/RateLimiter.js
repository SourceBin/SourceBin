class RateLimiter {
  constructor(delay) {
    this.delayed = new Set();
    setInterval(() => {
      this.delayed.clear();
    }, delay);
  }

  add(key) {
    return this.delayed.add(key);
  }

  active(key) {
    return this.delayed.has(key);
  }
}
module.exports = RateLimiter;
