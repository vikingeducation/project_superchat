
const redisClient = require('./createClient');
function addRoom(roomName) {

  redisClient.lpush('rooms', `room:${roomName}`);
}

function getRooms() {
  return new Promise(resolve => {
    redisClient.lrange(`rooms`, 0, -1, (err, roomNames) => {
      resolve(roomNames);
    });
  });
}


module.exports = {addRoom, getRooms};