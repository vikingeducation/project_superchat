const redis = require("redis");
const redisClient = redis.createClient();

module.exports = {
  // Given a hash, a key, and a value, set the key to the value
  // return a promise that is passed {key: value}
  setHash: function(hash, key, value) {
    return new Promise((resolve, reject) => {
      redisClient.hset(hash, key, value, err => {
        if (err) reject(err);
        else resolve({ [key]: value });
      });
    });
  },

  // Given a hash and a key remove the associated value from the hash
  // return a promise passed true if successful, or false
  delHash: function(hash, key) {
    return new Promise((resolve, reject) => {
      redisClient.hdel(hash, key, (err, result) => {
        if (err) reject(err);
        else resolve(Boolean(result));
      });
    });
  },

  // Given a hash, and a key increment the value for the key by 1
  // return a promise passed the new value
  incrHash: function(hash, key) {
    return new Promise((resolve, reject) => {
      redisClient.hincrby(hash, key, 1, (err, count) => {
        if (err) reject(err);
        else resolve({ [key]: count });
      });
    });
  },

  // Given and hash name and a key
  // return a promise that resolves the value associated with that key
  getHash: function(hash, key) {
    return new Promise((resolve, reject) => {
      redisClient.hget(hash, key, (err, value) => {
        if (err) reject(err);
        else resolve({ [key]: value });
      });
    });
  },

  // Given a hash name
  // return a promise that resolves to an object representing the hash
  getAllHash: function(hash) {
    return new Promise((resolve, reject) => {
      redisClient.hgetall(hash, (err, object) => {
        if (err) reject(err);
        else resolve(object);
      });
    });
  },

  // Given a list name
  // Return a promise that resolves to an array of the list items
  getAllList: function(listName) {
    return new Promise((resolve, reject) => {
      redisClient.lrange(listName, 0, -1, (err, arr) => {
        if (err) reject(err);
        else resolve(arr);
      });
    });
  },

  // Given a list name and a value, return a promise
  // that resolves the new length of the list
  addList: function(listName, value) {
    return new Promise((resolve, reject) => {
      redisClient.rpush(listName, value, (err, length) => {
        if (err) reject(err);
        else resolve(length);
      });
    });
  },

  // Given a list name and an array of values, return a promise
  // that resolves the new length of the list
  addListArr: function(listName, values) {
    return new Promise((resolve, reject) => {
      redisClient.rpush(listName, ...values, (err, length) => {
        if (err) reject(err);
        else resolve(length);
      });
    });
  }
};
