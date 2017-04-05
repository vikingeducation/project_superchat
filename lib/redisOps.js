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
  getChatRoom(roomName)
  .then((data) => {
    return data;
  }, (err) => {
    return err;
  });
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








module.exports = { 
  createChatRoom,
  getChatRoom,
  getChatRoomMessages
  
};






