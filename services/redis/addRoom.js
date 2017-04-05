const shortid = require('shortid'); 

function addRoom(roomName) {
  let id = shortid.generate();
  redisClient.hmset(`rooms:${id}`, {
      name: roomName
    }
  );
}

module.exports = addRoom;