const redisClient = require("redis").createClient();

module.exports = function(roomId) {
  if (roomId !== undefined && !isNaN(+roomId)) {
    return redisClient.
  }
};
