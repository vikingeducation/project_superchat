const usernameHelpers = require("./get_user_info");
const chatroomHelpers = require("./room_info");
const shortid = require("shortid");

module.exports = {
  generateUserInfo: username => {
    const userId = shortid.generate();
<<<<<<< HEAD
    return loginRedisHelpers
      .storeUserId(userId)
      .then(userId => loginRedisHelpers.storeUsername(userId, username));
  }

  // GET ROOMS
};
=======
    return (usernameHelpers.storeUserId(userId)
    .then(userId => usernameHelpers.storeUsername(userId, username)))
  },

  generateRoomInfo: (roomName) => {
    const userId = shortid.generate();
    return (chatroomHelpers.storeRoomId(roomId)
    .then(roomId => chatroomHelpers.storeRoomName(roomId, roomName)))
  }
}
>>>>>>> edc3bedeb2e17a33cbf8b087af22f750055e67a1
