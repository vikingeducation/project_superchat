const redisClient = require("redis").createClient();

module.exports = {
  getRoomName: (roomId) => {
    return new Promise((resolve, reject) => {
      redisClient.get(roomId, (err, username) => {
        (err) ? reject(err) : resolve(username);
      })
    })
  },

  getRoomIds: () => {
    return new Promise((resolve, reject) => {
      redisClient.lrange("ROOM_IDS", 0, -1, (err, roomIds) => {
        (err) ? reject(err) : resolve(roomIds);
      })
    })
  }
}
