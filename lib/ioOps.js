const redisOps = require("./redisOps");

let ioOps = {};


ioOps.makeNewRoomHTML = function makeNewRoomHTML(roomName) {
    
    let htmlString = `<tr><td>${ roomName }</td></tr>`;
    return htmlString
}






module.exports = ioOps;