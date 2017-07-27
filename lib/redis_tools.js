const usernameHelpers = require("./get_user_info");
const chatroomHelpers = require("./room_info");
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
  }
};
