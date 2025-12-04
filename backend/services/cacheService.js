const { LRUCache } = require('lru-cache');  // ✅ New v10+ import

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 5,  // 5 minutes
});

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, { ttl }),
  has: (key) => cache.has(key),
  delete: (key) => cache.delete(key)
};
