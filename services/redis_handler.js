const Promise = require("bluebird");
const redisClient = Promise.promisifyAll(require("redis").createClient());

function createRoom(room) {
  //let Obj = { [room]: 0 };
  return redisClient.hsetAsync(room, room, 0);
}

function newMessage(room, user, message) {
  return new Promise(resolve => {
    redisClient.hgetallAsync(room).then(chatRoom => {
      redisClient.hincrbyAsync(room, room, 1).then(num => {
        let userIndexed = num + ":" + user;
        redisClient
          .hmsetAsync(room, { [room]: num, [userIndexed]: message })
          .then(() => {
            resolve();
          });
      });
    });
  });
}

function getAllData() {
  return new Promise(resolve => {
    redisClient.keysAsync("*").then(chatNames => {
      let promArray = chatNames.map(chatName =>
        redisClient.hgetallAsync(chatName)
      );
      Promise.all(promArray).then(chatRooms => {
        resolve(chatRooms);
      });
    });
  });
}

// function removeUserIndexes(chatRooms) {
//   let newRoom = {};
//   let newData = [];
//   let arr = [];
//   chatRooms.forEach(el => {
//     Object.keys(el).forEach((ele, idx) => {
//       if (idx !== 0) {
//         newRoom[ele.split(":")[1]] = el[ele];
//       } else {
//         newRoom[ele] = el[ele];
//       }
//     });
//     newData.push(newRoom);
//     newRoom = {};
//   });
//   return newData;
// }

module.exports = {
  getAllData,
  newMessage,
  createRoom
};
