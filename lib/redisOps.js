const bluebird = require('bluebird');
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = require("redis").createClient();

function createChatRoom(roomName) {
  let listOfMessages = "[]";
  return new Promise((resolve, reject) => {
    redisClient.hsetnx("rooms", roomName, listOfMessages, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function getChatRoomMessages(roomName) {
  getChatRoom(roomName).then(
    data => {
      return data;
    },
    err => {
      return err;
    }
  );
}

function getChatRoom(roomName) {
  return new Promise((resolve, reject) => {
    redisClient.hget("rooms", roomName, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function getAllChatRooms() {
  return _getAllOfHash("rooms");
}


/* Returns an array of strings corresponding to the unique ID
of the messages
@params roomName {String} name of room
*/
function getNamesOfMessagesByChatRoom(roomName) {
  return new Promise((resolve, reject) => {
    redisClient.lrange(roomName, 0, -1, (err, arr) => {
      if (err) {
        reject(err);
      }
      resolve(arr);
    });
  });
}


//loop through the array
//redisClient.get(messageName)
//JSON parse the data we get back
//data will be an object with properties user, room, message
//Make an array of these objects and pass it back
function lookupMessagesAndJSONParse(arrOfMessageNames) {
  
  
  
  
}






function _getAllOfHash(hash) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(hash, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
function createMessage(messageObj) {
  let newObj = {};
  newObj.user = messageObj.usersName;
  newObj.message = messageObj.newMessage;
  newObj.room = messageObj.currentChatroom;
  newObj = JSON.stringify(newObj);
  return new Promise((resolve, reject) => {
    redisClient.hset("messages", Date.now(), newObj, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = {
  createChatRoom,
  getChatRoom,
  getChatRoomMessages,
  getAllChatRooms,
  createMessage,
  getAllMessageByChatRoom
};




// redisClient.lpush("rooms", "default");
// //Grab the default room and pull from it?

// let messageID = "message" + Date.now();
// redisClient.setnx(messageID, JSON.stringify({
//   user: "welcome",
//   message: "welcome to default",
//   room: "default"
// }));
// //Add this newly created message to the default's field in the rooms key
// redisClient.lpush("default", messageID);
