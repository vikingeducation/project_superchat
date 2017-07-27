const redisClient = require("redis").createClient();

module.exports = {
  getMessage: (messageId) => {
    return new Promise((resolve, reject) => {
      redisClient.hmget(messageId, (err, message) => {
        (err) ? reject(err) : resolve(message);
      })
    })
  },

  getMessageIds: () => {
    return new Promise((resolve, reject) => {
      redisClient.lrange("MESSAGE_IDS", 0, -1, (err, messageIds) => {
        (err) ? reject(err) : resolve(messageIds);
      })
    })
  }
}
