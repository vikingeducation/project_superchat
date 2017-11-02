const redisClient = require('redis').createClient();

// function _getRoomList() {
//   return new Promise((resolve, reject) => {
//     redisClient.lrange('rooms', 0, -1, (err, reply) => {
//       if (err) reject(err);
//       resolve(reply);
//     });
//   });
// }

function addRoom(room) {
  const stdRoom = room.toLowerCase();
  return new Promise((resolve, reject) => {
    redisClient.sadd('rooms', stdRoom, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function getAllRooms() {
  return new Promise((resolve, reject) => {
    redisClient.smembers('rooms', (err, rooms) => {
      if (err) reject(err);
      resolve(rooms.sort());
    });
  });
}

//   const roomList = await _getRoomList();
//   const rooms = [];
//   const p = new Promise((resolve, reject) => {
//     roomList.forEach((room) => {
//       redisClient.hgetall(`room:${room}`, (err, reply) => {
//         if (err) reject(err);
//         rooms.push(reply);
//       });
//     });
//     resolve(rooms);
//   });
//   p.then(() => {
//     callback(rooms);
//   });
// }

module.exports = {
  addRoom,
  getAllRooms,
};
