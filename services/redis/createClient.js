const REDIS_URL =
  "//redis://h:pa7197a8fa17cf6198d9678029a5799998c0ec3723dd70530e027f6f8a1c97188@ec2-34-197-198-120.compute-1.amazonaws.com:34499";

// const redisClient = require("redis").createClient(process.env.REDIS_URL);
const redisClient = require("redis").createClient();

module.exports = redisClient;
