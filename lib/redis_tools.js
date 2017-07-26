const redisClient = require("redis").createClient();
redisClient.usernames = [];

var storeUsername = function(username) {
  return new Promise((resolve, reject) => {
    redisClient.lpush("usernames", username, (err, reply) => {
      if (err) reject(err);
      // User data storage worked correctly
      // redisClient.end() => do this if not working correctly
      redisClient.usernames.push(username);
      console.log(redisClient.usernames);
      resolve();
    });
  });
};
var getUsernames = () => {
  return redisClient.usernames;
};
storeUsername.usernames = redisClient.usernames;

module.exports = {
  storeUsername,
  getUsernames
};
