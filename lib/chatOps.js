const redisOps = require("./redisOps");

let chatOps = {};

chatOps.getChatRoom = redisOps.getChatRoom;
chatOps.getChatRoomMessages = redisOps.getChatRoomMessages;

chatOps.makeNewRoom = function makeNewRoom(roomName) {
  redisOps.createChatRoom(roomName).then(success => {
    console.log("the value of success " + success);
    if (success) {
      return chatOps.makeNewRoomHTML(roomName);
    } else {
      return false;
    }
  });
};

chatOps.makeNewRoomHTML = function makeNewRoomHTML(roomName) {
  let htmlString = `<tr><td>${roomName}</td></tr>`;
  return htmlString;
};

//stageing
//redisstuff
//buildHTML

module.exports = chatOps;
