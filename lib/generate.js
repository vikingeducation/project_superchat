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
// generateUserInfo('catluver');
// generateUserInfo('dogluver');
// generateUserInfo('horseluver');

let generateMessageInfo = (message, username, roomName) => {
   const messageID = shortid.generate().slice(0, 7);
   return messages.saveMessageID(messageID).then((messageID) => {
      messages.saveMessage(messageID, message, username, roomName);
   });
};

// generateMessageInfo('Cats are my favorite.', 'catluver','cats');
// generateMessageInfo('Dogs are my favorite.', 'dogluver', 'dogs');
// generateMessageInfo('Horses are my favorite', 'horseluver', 'horses');

let generateRoomInfo = (roomName) => {
   const roomID = shortid.generate().slice(0, 7);
   return rooms.saveRoomID(roomID).then((roomID) => {
      rooms.saveRoomName(roomID, roomName);
   });
};

// generateRoomInfo('cats');
// generateRoomInfo('dogs');
// generateRoomInfo('horses');

module.exports = {
   generateUserInfo,
   generateMessageInfo,
   generateRoomInfo
};