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
  return _getAllOfHash("messages").then(function onFulfilled(messagesJSON) {
    let messagesArray = JSON.parse(messagesJSON);
    let roomMessage = messagesArray.map((element) => {
      if (element.room === roomName) {
        return element;
      }
    });
    return roomMessage;
  });
};



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
  newObj.username = messageObj.usersName;
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
