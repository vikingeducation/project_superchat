const redis = require('redis');
const redisClient = redis.createClient();

module.exports = {
  // Given a hash, a key, and a value, set the key to the value
  // return a promise that is passed {key: value}
  set: function(hash, key, value) {
    return new Promise((resolve, reject) => {
      redisClient.hset(hash, key, value, err => {
        if (err) reject(err);
        else resolve({ [key]: value });
      });
    });
  },

  // Given a hash, and a key increment the value for the key by 1
  // return a promise passed the new value
  incr: function(hash, key) {
    return new Promise((resolve, reject) => {
      redisClient.hincrby(hash, key, 1, (err, count) => {
        if (err) reject(err);
        else resolve({ [key]: count });
      });
    });
  },

  // Given and hash name and a key
  // return a promise that resolves the value associated with that key
  get: function(hash, key) {
    return new Promise((resolve, reject) => {
      redisClient.hget(hash, key, (err, value) => {
        if (err) reject(err);
        else resolve({ [key]: value });
      });
    });
  },

  // Given a hash name
  // return a promise that resolves to an object representing the hash
  getAll: function(hash) {
    return new Promise((resolve, reject) => {
      redisClient.hgetall(hash, (err, object) => {
        if (err) reject(err);
        else resolve(object);
      });
    });
  }
};
