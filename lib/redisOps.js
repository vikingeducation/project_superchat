//const redisClient = require("redis").createClient();

function createChatRoom(roomName) {
  let listOfMessages = [];
  redisClient.hsetnx("rooms", roomName, listOfMessages, (err, data) => {
    callback(shortUrl);
  });
}

module.exports = {};
