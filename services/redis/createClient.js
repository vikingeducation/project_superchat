const REDIS_URL = "//redis://h:pb5c2e26ab92764898753f7d9b135ea957fb475eae0f263579bca67bbd3a49468@ec2-34-206-56-30.compute-1.amazonaws.com:41149"

// const redisClient = require("redis").createClient(process.env.REDIS_URL);
const redisClient = require("redis").createClient();

module.exports = redisClient;