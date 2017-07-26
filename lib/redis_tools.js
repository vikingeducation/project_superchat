const redisClient = require("redis").createClient();
redisClient.usernames = [];

const storeUsername = function(username) {
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

const storeMessage = function(messageObj) {
  return new Promise((resolve, reject) => {
    // console.log(messageObj);
    // console.log(Object.keys(messageObj));
    redisClient.lpush("messages", {
      username: messageObj.username,
      message: messageObj.message
    })
    if(err) reject(err);
    console.log("working maybe");
    resolve();
  })
}

const getMessages = function() {

}

var getUsernames = () => {
  return redisClient.usernames;
};
storeUsername.usernames = redisClient.usernames;

module.exports = {
  storeUsername,
  getUsernames,
  storeMessage
};
