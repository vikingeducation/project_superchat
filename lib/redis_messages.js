const redisClient = require("redis").createClient();
const { getMessageIds, getMessage } = require("./get_message_helpers");

module.exports = {
  storeMessageId: (messageId) => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("MESSAGE",messageId,
      (error,data) => {if(error) throw error; resolve();});
    })
  },

  storeMessage: (messageId, message, username, roomName) => {
    return new Promise((resolve, reject) => {
      redisClient.hmset(messageId, {
        message: message,
        username: username,
        roomName: roomName
      }, (error,data) => {
        if(error) throw error;
        resolve();
      })
    })
  },

  getMessages: () => {
    return getMessageIds.then(messageIds => {
      return Promise.all(
        messagesIds.map(messageId => {
          return getMessage(messageId);
        })
      )
    })
  }
}
