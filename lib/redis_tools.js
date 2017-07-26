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

// {
//   username: messageObj.username,
//   message: messageObj.message
// }.toString()

const storeMessage = function(messageObj) {
  return new Promise((resolve, reject) => {
    var str = messageObj.userName + " : " + messageObj.message;
    redisClient.lpush("messages", str, (err, replay) => {
      resolve();
    });
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange("messages", 0, -10, (err, data) => {
      if (err) reject(err);
      //console.log(data);
      resolve(data);
    });
  });
};

const getUsernames = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange("usernames", 0, -1, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
};

module.exports = {
  storeUsername,
  getUsernames,
  storeMessage,
  getMessages
};
