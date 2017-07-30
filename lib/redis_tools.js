const usernameHelpers = require("./get_user_info");
const chatroomHelpers = require("./room_info");
const messageHelpers = require("./redis_messages");
const shortid = require("shortid");

module.exports = {
  generateUserInfo: username => {
    const userId = shortid.generate();
    return usernameHelpers
      .storeUserId(userId)
      .then(userId => usernameHelpers.storeUsername(userId, username));
  },

  generateRoomInfo: roomName => {
    const roomId = shortid.generate();
    return chatroomHelpers
      .storeRoomId(roomId)
      .then(roomId => chatroomHelpers.storeRoomName(roomId, roomName));
  },

  generateMessageInfo: (message, username, roomName) => {
    const messageId = shortid.generate()
    return messageHelpers
      .storeMessageId(messageId)
      .then(messageId => messageHelpers.storeMessage(messageId, message, username, roomName));
  }
};
