const shortid = require('shortid'); 

function addRoom(roomName) {
  let id = shortid.generate();
  redisClient.hmset(`rooms:${roomName}`);
}

module.exports = addRoom;