//Redis Access
const shortid = require("shortid");
const redisClient = require("redis").createClient();
const renderHelper = require("../index.js");

function postMessage(client, newMessage, room) {
  let messageID = generateMessageID();

  // DON'T FORGET TO CHANGE THESE GEEEEEZE
  let user = client.username;
  //let room = currentActiveRoom
  //let room = 'room1';

  redisClient.hmset(
    messageID,
    "messageBody",
    newMessage,
    "username",
    user,
    "roomName",
    room
  );

  let roomKey = "room_" + room;

  let userAndMessage = user + ":" + newMessage;

  redisClient.hmset(roomKey, messageID, userAndMessage);

  //add this message to its room's messages
}

function getUserList(client, newUser) {
  console.log("Starting getUserList");
  var p = new Promise(function(resolve, reject) {
    redisClient.keys("user_*", (err, userList) => {
      console.log("Keys for userList: " + userList);
      if (userList.length === 0) {
        resolve(userList);
      }
      resolve(userList);
    });
  });

  p.then(userList => {
    checkForExistingUser(userList, client, newUser);
  });
}

function checkForExistingUser(userList, client, newUser) {
  if (!userList.includes("user_" + newUser)) {
    let userKey = "user_" + newUser;
    redisClient.setnx(userKey, newUser);

    client.username = newUser;
    client.emit("userAccepted", newUser);
  } else {
    console.log("Username taken");
    client.emit("userDenied", newUser);
  }
}

function destroyUser(userToDestroy) {
  redisClient.del(userToDestroy);
}

function generateMessageID() {
  return "message_" + shortid.generate();
}

//will be updated to get messages from room
function getAllMessages(roomToPopulate) {
  let roomsObj = {};

  // pass handlebars an objects
  // Object.keys(roomsObj)
  // for each key, grab the value (userAndMessage list)
  //

  // return new Promise(function(resolve, reject) {
  //   redisClient.keys("message_*", (err, keys) => {
  //     if (keys.length === 0) {
  //       resolve(messagesObj);
  //     }
  //
  //     keys.forEach(key => {
  //       redisClient.hgetall(key, (err, message) => {
  //         messagesObj[key] = message;
  //         if (checkLengths(messagesObj, keys)) {
  //           resolve(messagesObj);
  //         }
  //       });
  //     });
  //   });
  // });
}

function checkLengths(messagesObj, keys) {
  if (Object.keys(messagesObj).length === keys.length) {
    return true;
  } else {
    return false;
  }
}

function getAllRoomNames() {
  console.log("inside getAllRoomNames ");
  var roomNameArr = [];
  return new Promise((resolve, reject) => {
    redisClient.keys("room_*", (err, results) => {
      if (results.length === 0) {
        resolve(roomNameArr);
      }
      if (err) reject(err);
      results.forEach(key => {
        redisClient.hget(key, "roomName", (err, roomNameResult) => {
          console.log("inside getAllRoomNames roomNameResult", roomNameResult);
          roomNameArr.push(roomNameResult);

          if (results.length === roomNameArr.length) {
            console.log("inside getAllRoomNames ", roomNameArr);
            resolve(roomNameArr);
          }
        });
      });
    });
  });
}

function addRoom(roomName) {
  var roomHash = "room_" + roomName;
  redisClient.hsetnx(roomHash, "roomName", roomName);
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
  getAllRoomNames,
  addRoom
};
