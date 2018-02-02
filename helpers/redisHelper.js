const RedisHelper = {
  createClient: () => {
    const redis = require('redis');
    let redisClient;
    if (process.env.REDISTOGO_URL) {
      var rtg   = require("url").parse(process.env.REDISTOGO_URL);
      redisClient = redis.createClient(rtg.port, rtg.hostname);

      redisClient.auth(rtg.auth.split(":")[1]);
    } else {
      redisClient = redis.createClient();
    }
    return redisClient;
  }
};

module.exports = RedisHelper;
