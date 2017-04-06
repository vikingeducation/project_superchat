//Redis Access
const shortid = require('shortid');
const redisClient = require('redis').createClient();
const renderHelper = require('../index.js');

function postMessage(client, newMessage) {
  let messageID = generateMessageID();

  // DON'T FORGET TO CHANGE THESE GEEEEEZE
  let user = client.username;
  //let room = currentActiveRoom
  let room = 'room1';

  redisClient.hmset(
    messageID,
    'messageBody',
    newMessage,
    'username',
    user,
    'roomName',
    room
  );

  //add this message to its room's messages
}

function getUserList(client, newUser) {
  var p = new Promise(function(resolve, reject) {
    redisClient.keys('user_*', (err, userList) => {
      resolve(userList);
    });
  });

  p.then(userList => {
    checkForExistingUser(userList, client, newUser);
  });
}

function checkForExistingUser(userList, client, newUser) {
  if (!userList.includes('user_' + newUser)) {
    let userKey = 'user_' + newUser;
    redisClient.setnx(userKey, newUser);

    client.username = newUser;
    client.emit('userAccepted', newUser);
  } else {
    console.log('Username taken');
    client.emit('userDenied', newUser);
  }
}

function destroyUser(userToDestroy) {
  redisClient.del(userToDestroy);
}

function generateMessageID() {
  return 'message_' + shortid.generate();
}

//will be updated to get messages from room
function getAllMessages() {
  let messagesObj = {};

  return new Promise(function(resolve, reject) {
    redisClient.keys('message_*', (err, keys) => {
      if (keys.length === 0) {
        resolve(messagesObj);
      }

      keys.forEach(key => {
        redisClient.hgetall(key, (err, message) => {
          messagesObj[key] = message;
          if (checkLengths(messagesObj, keys)) {
            resolve(messagesObj);
          }
        });
      });
    });
  });
}

function checkLengths(messagesObj, keys) {
  if (Object.keys(messagesObj).length === keys.length) {
    return true;
  } else {
    return false;
  }
}

function createRoom() {}

function getAllRoomNames() {
  let rooms = [];

  // return redisClient.keys('room_*', (err, keys) => {
  //   return rooms;
  // });

  return new Promise(function(resolve, reject) {
    redisClient.keys('room_*', (err, keys) => {
      // if (keys.length === 0) {
      //   //[room_cats, room_dogs]
      //   resolve(rooms);
      // }
      //if (keys.length === rooms.length)
      resolve(keys);
      // keys.forEach(key => {
      //   redisClient.hgetall(key, (err, message) => {
      //     messagesObj[key] = message;
      //     if (checkLengths(messagesObj, keys)) {
      //       resolve(messagesObj);
      //     }
      //   });
      // });
    });
  });
}

//when user clicks on room name
//open that room
//get all messages from that room object
//room_cats:
//list of messagesIDs(which can be used to access the message itself)
//
//room_dogs:
//list of messages with their associated author

//messages database:
//message_01: body, author, room

//Display messages for a given room:
//get room ID
//Look at all messages and pull out messages with a specific room ID

//Room_id: room name, count of users who have posted
//Rooms: list of room names
module.exports = {
  postMessage,
  getUserList,
  checkForExistingUser,
  getAllMessages,
  destroyUser,
  getAllRoomNames
};
