const redisClient = require("redis").createClient();
const { getRoomName, getRoomIds } = require("./get_room_info_helpers");

module.exports = {
  storeRoomId: (roomId) => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("ROOM_IDS", roomId, (err, reply) => {
        (err)
          ? reject(err)
          : resolve(userId);
      })
    })
  },

  storeRoomName: (roomId, roomName) => {
    return new Promise((resolve, reject) => {
      redisClient.set(roomId, roomName, (err, reply) => {
        (err)
          ? reject(err)
          : resolve();
      });
    })
  },

  getRooms: () => {
    return (getRoomIds().then((userIds) => {
      return Promise.all(userIds.map((userId) => {
        return getUsername(userId);
      }))
    }))
  }
}
