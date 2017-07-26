const Promise = require("bluebird");
const redisClient = Promise.promisifyAll(require("redis").createClient());

//room: membercount

function handleEvent(event, room, user, message) {
  return new Promise(resolve => {
    switch (event) {
      case joinRoom:
        joinRoom(room).then(resolve());
        break;
      case exitRoom:
        exitRoom(room).then(resolve());
        break;
      case createRoom:
        createRoom(room).then(resolve());
        break;
      case newMessage:
        newMessage(room, user, message).then(resolve(data));
        break;
      default:
    }
  });
}

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
  return redisClient.hgetallAsync(room, chatRoom => {
    i = chatRoom.postCount;
    i++;
    let userKey = i + ":" + user;
    redisClient.hsetAsync(room, { postCount: i, userKey: message });
  });
}

function getAllData() {
  var endData = {};
  redisClient.keysAsync("*").then(data => {
    data = data.filter(el => el !== "chatRooms");
    data.forEach(el => {
      redisClient.hgetallAsync(el).then(() => {
        endData[el] = data;
      });
    });
  });
  return endData;
}

console.log(getAllData());

module.exports = {};
