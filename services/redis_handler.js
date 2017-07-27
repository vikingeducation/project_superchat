const Promise = require("bluebird");
const redisClient = Promise.promisifyAll(require("redis").createClient());

function createRoom(room) {
  let Obj = { [room]: 0 };
  return redisClient.hmsetAsync(room, Obj);
}

function newMessage(room, user, message) {
  redisClient.hgetallAsync(room).then(chatRoom => {
    let i = chatRoom[chatRoom] + 1;
    let userIndexed = i + ":" + user;
    redisClient.hmsetAsync(room, { [room]: i, [userIndexed]: message });
  });
}

function getAllData() {
  return new Promise(resolve => {
    redisClient.keysAsync("*").then(chatNames => {
      let promArray = chatNames.map(chatName =>
        redisClient.hgetallAsync(chatName)
      );
      Promise.all(promArray).then(chatRooms => {
        resolve();
      });
    });
  });
}

function stripAuthorIndex(chatRooms) {
  let newData = [];
  chatRooms.forEach(room => {});
}

module.exports = {
  getAllData,
  newMessage,
  createRoom
};
