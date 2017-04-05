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

function getAllMessageByChatRoom(roomName) {
  return _getAllOfHash("messages").then(function onFulfilled(messagesObj) {
    console.log(`messagesObh of getAllMessageByChatRoom is ${ messagesObj}`);
    console.log(`roomName passed to getAllMessageByChatRoom is ${ roomName} `);
    let messagesKeys = Object.keys(messagesObj);
    console.log(`messagesKeys is ${ messagesKeys }`);
    let roomMessage = messagesKeys.map(key => {
      if (messagesObj[key].room === roomName) {
        return messagesObj[key];
      }
    });
    return roomMessage;
  });
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
// redisClient.hsetnx("rooms", "default", "[]");
// redisClient.hsetnx("messages", "default_time", {
//   user: "welcome",
//   message: "welcome to default",
//   room: "default"
// });
