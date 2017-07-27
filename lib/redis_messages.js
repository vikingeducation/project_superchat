// get messages by room
// get message by id
// get all messages
// store message
const redisClient = require("redis").createClient();

module.exports = {
  storeMessageId: (messageId) {
    return new Promise((resolve, reject) => {
      redisClient.lpush("MESSAGE")
    })
  }


  storeMessage: (messageId, message, userId, roomId) {
    return new Promise((resolve, reject) => {
      redisClient.hmset(messageId, {
        message: message,
        userId: userId,
        roomId: roomId
      })
    })
  },

}
