const redisClient = require('redis').createClient();

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

module.exports = {
  addRoom,
  getAllRooms,
};
