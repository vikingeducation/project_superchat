const redisClient = require("redis").createClient();
//redisClient.usernames = redisClient.usernames || [];

const storeUsername = function(username) {
  return new Promise((resolve, reject) => {
    redisClient.lpush("usernames", username, (err, reply) => {
      if (err) reject(err);
      // User data storage worked correctly
      // redisClient.end() => do this if not working correctly

      resolve();
    });
  });
};

const storeMessage = function(messageObj) {
  return new Promise((resolve, reject) => {
    // console.log(messageObj);
    // console.log(Object.keys(messageObj));

    // redisClient.lpush("messages", {
    //   username: messageObj.username,
    //   message: messageObj.message
    // });
    redisClient.lpush("messages",
    if (err) reject(err);
    console.log(redisClient.messages);
    resolve();
  });
};

const getMessages = function() {};

var getUsernames = () => {
  return redisClient.usernames;
};
storeUsername.usernames = redisClient.usernames;

module.exports = {
  storeUsername,
  getUsernames,
  storeMessage
};
