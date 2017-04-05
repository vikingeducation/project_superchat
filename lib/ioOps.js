const redisOps = require("./redisOps");

let ioOps = {};


ioOps.createChatRoom = redisOps.createChatRoom;
ioOps.getChatRoom = redisOps.getChatRoom;
ioOps.getChatRoomMessages = redisOps.getChatRoomMessages;



ioOps.makeNewRoomHTML = function makeNewRoomHTML(roomName) {
    
    let htmlString = `<tr><td>${ roomName }</td></tr>`;
    return htmlString
}






module.exports = ioOps;