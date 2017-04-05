const redisOps = require("./redisOps");

let chatOps = {};

chatOps.getChatRoom = redisOps.getChatRoom;
chatOps.getChatRoomMessages = redisOps.getChatRoomMessages;

chatOps.makeNewRoom = function makeNewRoom(roomName) {
  return redisOps.createChatRoom(roomName).then(success => {
    if (success) {
      let newRoom = chatOps.makeNewRoomHTML(roomName);
      return newRoom;
    } else {
      return false;
    }
  });
};

chatOps.buildMessageTable = function buildMessageTable(roomName) {
  return redisOps.getAllMessageByChatRoom(roomName).then(messagesArray => {
    let htmlString = "";

    messagesArray.forEach((element, index) => {
      htmlString += chatOps.makeNewMessageHTML(element);
    });

    return htmlString;
  });
};

chatOps.buildChatTable = function buildChatTable() {
  return redisOps.getAllChatRooms().then(roomsObj => {
  let roomNames = Object.keys(roomsObj);
  let htmlString = "";

  roomNames.forEach((element, index) => {
  htmlString += chatOps.makeNewRoomHTML(element);
  });

  return htmlString;
  });
};





chatOps.makeNewRoomHTML = function makeNewRoomHTML(roomName) {
  let htmlString = `<tr><td>${roomName}</td></tr>`;
  return htmlString;
};

chatOps.makeNewMessage = function makeNewMessage(messageObj) {
  return redisOps.createMessage(messageObj).then(success => {
    if (success) {
      let newRoom = chatOps.makeNewMessageHTML(messageObj);
      return newRoom;
    } else {
      return false;
    }
  });
};
chatOps.makeNewMessageHTML = function makeNewMessageHTML(messageObj) {
  let htmlString = `<tr><td>Username ${messageObj.user}<br>${messageObj.message}</td></tr>`;
  return htmlString;
};
//stageing
//redisstuff
//buildHTML

module.exports = chatOps;
