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
  return redisClient.hmsetAsync(room, Obj);
}

function newMessage(room, user, message) {
  let i;
  redisClient
    .hgetallAsync(room)
    .then(chatRoom => {
      i = chatRoom.postCount;
      i++;
      let userKey = i + ":" + user;
      redisClient.hsetAsync(room, { postCount: i, userKey: message });
    })
    .then(() => {
      redisClient.keys(room).then(data => {
        return data.slice(data.length - 2).push(room);
      });
    });
}

function getAllData() {
  var endData = {};
  redisClient.keysAsync("*").then(data => {
    let newData = data.filter(el => el !== "chatRooms");
    newData.forEach(el => {
      redisClient.hgetallAsync(el).then(data => {
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
