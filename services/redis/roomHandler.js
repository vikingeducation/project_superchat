const redisClient = require('./createClient');

function addRoom(roomName) {
  redisClient.lpush('rooms', `room:${roomName}`);
}

function getRoomIDs() {
  return new Promise(resolve => {
    redisClient.lrange('rooms', 0, -1, (err, roomIDArray) => {
      resolve(roomIDArray);
    });
  });
}


module.exports = {addRoom, getRoomIDs};