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
<<<<<<< HEAD
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
=======
    redisClient.lpush("messages", messageObj.message, (err, replay) => {
      resolve();
    });
>>>>>>> f7498f77cca9b3041af3d75fb3fa8251388f8651
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange("messages", 0, -1, (err, data) => {
      if(err) reject(err);
      console.log(data);
      resolve(data);
    })
  })
}

const getUsernames = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange("usernames", 0, -1, (err, data) => {
      if(err) reject(err);
      resolve(data);
    })
  })
}

module.exports = {
  storeUsername,
  getUsernames,
  storeMessage,
  getMessages
};
