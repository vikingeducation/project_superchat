const Promise = require("bluebird");
const redisClient = Promise.promisifyAll(require("redis").createClient());

//room: membercount

function joinRoom(room) {
  return redisClient.hincrbyAsync("chatRooms", room, 1);
}

function exitRoom(room) {
  return redisClient.hdecrbyAsync("chatRooms", room, 1);
}

function createRoom(room) {
  let Obj = { postCount: 0 };
  return redisClient.hmsetAsync(name, Obj);
}

function newMessage(room, user, message) {
  let i;
  return redisClient.hgetall(room, chatRoom => {
    i = chatRoom.postCount;
    i++;
    let userKey = i + ":" + user;
    redisClient.hsetAsync(room, { postCount: i, userKey: message });
  });
}

function getAllData() {
  var endData = {};
  redisClient.keys("*", (data) => {
    data = data.filter(el => el !== "chatRooms");
    data.forEach(el => {
      redisClient.hgetall(el, (data) => {
        endData[el] = data;
      });
    });
  });
  return endData;
}

module.exports = {
  getAllData, 
  newMessage, 
  createRoom, 
  exitRoom, 
  joinRoom
};
