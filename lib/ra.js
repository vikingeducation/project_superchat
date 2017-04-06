//Redis Access
const shortid = require('shortid');
const redisClient = require('redis').createClient();
const renderHelper = require('../index.js');

function postMessage(client, newMessage) {
  let messageID = generateMessageID();

  // DON'T FORGET TO CHANGE THESE GEEEEEZE
  let user = client.username;
  //let room =
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
  if (!userList.includes(newUser)) {
    let userKey = 'user_' + newUser;
    redisClient.setnx(userKey, newUser);

    client.username = newUser;
    client.emit('userAccepted', newUser);
  } else {
    console.log('Username taken');
    //client.emit('userAccepted');
  }
}

function generateMessageID() {
  return 'message_' + shortid.generate();
}

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

  // return
  // p.then(messageList => {
  //   console.log(renderHelper);
  //   renderHelper.renderHomePage(messageList);
  // });
}

function checkLengths(messagesObj, keys) {
  if (Object.keys(messagesObj).length === keys.length) {
    return true;
  } else {
    return false;
  }
}

// function getMessageKeys(messagesObj, keys) {
//   keys.forEach(key => {
//     redisClient.hgetall(key, (err, message) => {
//       messagesObj[key] = message;
//       checkLengths(messagesObj, keys);
//     });
//   });
// }

module.exports = {
  postMessage,
  getUserList,
  checkForExistingUser,
  getAllMessages
};
