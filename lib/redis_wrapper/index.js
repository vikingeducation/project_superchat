const redis = require("redis");
const Promise = require("bluebird");

redisClient = redis.createClient();

Promise.promisifyAll(redis.RedisClient.prototype);

module.exports = {};
