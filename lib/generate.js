const redisClient = require('redis').createClient();
const shortid = require('shortid');

// function library
const users = require('./users');
const messages = require('./messages');
const rooms = require('./rooms');

let generateUserInfo = (username) => {
   const userID = shortid.generate().slice(0, 7);
   return users.saveUserID(userID).then((userID) => {
      users.saveUsername(userID, username);
   });
};

// 
// generateUserInfo('New-User');

let generateMessageInfo = (message, username, roomName) => {
   const messageID = shortid.generate().slice(0, 7);
   return messages.saveMessageID(messageID).then((messageID) => {
      messages.saveMessage(messageID, message, username, roomName);
   });
};

// generateMessageInfo('this is a message', 'kooluser','tests');

let generateRoomInfo = (roomName) => {
   const roomID = shortid.generate.slice(0, 7);
   return rooms.saveRoomID(roomID).then((roomID) => {
      rooms.saveRoomName(roomID, roomName);
   });
};

module.exports = {
   generateUserInfo,
   generateMessageInfo,
   generateRoomInfo
};