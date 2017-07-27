const Promise = require("bluebird");
const redisClient = Promise.promisifyAll(require("redis").createClient());

//room: membercount

// function joinRoom(room) {
//   return redisClient.hincrbyAsync("chatRooms", room, 1);
// }

// function exitRoom(room) {
//   return redisClient.hdecrbyAsync("chatRooms", room, 1);
// }

function createRoom(room) {
  let Obj = { [room]: 0 };
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
  return new Promise( resolve => {
    redisClient.keysAsync('*').then(chatNames => {
      let promArray = chatNames.map(chatName => redisClient.hgetallAsync(chatName));
      Promise.all(promArray).then(chatRooms => {
        resolve(chatRooms);
      })
      })
    })
  }


module.exports = {
  getAllData,
  newMessage,
  createRoom,
  exitRoom,
  joinRoom
};
