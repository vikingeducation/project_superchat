const redisClient = require("redis").createClient();
const debug = require('debug')('dataMgr');
const ROOMKEY = "rooms";
const USERKEY = "users";

redisClient.flushall();

// promise returns 1 for room add 0 for duplicate room
function addRoom(room) {
  debug(`requesting add room "${room}"`);
  return new Promise(function(resolve, reject) {
    redisClient.sadd(ROOMKEY, room, function(err, data) {
      if (err) reject(err);
      debug(`room added "${room}"`);
      resolve(data);
    });
  });
}

// promise returns array with list of rooms
function listRooms() {
  debug(`requesting room list`);
  return new Promise(function(resolve, reject) {
    redisClient.smembers(ROOMKEY, function(err, data) {
      if (err) reject(err);
      debug('returning room list');
      resolve(data);
    });
  });
}

function addUser(userName, userProfile) {
  debug(`adding new user "${userName}" with profile ${userProfile}`);
  return new Promise(function(resolve, reject) {
    redisClient.hset(USERKEY, userName, JSON.stringify(userProfile), function(err, data) {
      if (err) reject(err);
      debug(`user added "${userName}"`);
      resolve(data);
    });
  });
}

// promise returns object containing the profile associated with userName or Null object if doesn't exist
function getUser(userName) {
  debug(`requesting user "${userName}"`);
  return new Promise(function(resolve, reject) {
    redisClient.hget(USERKEY, userName, function( err, data) {
      if (err) reject(err);
      debug(`user "${userName}" returned with profile ${data}`);
      resolve(JSON.parse(data));
    });
  });
}

// promise returns 1 if user exists and 0 otherwise
function isUser(userName) {
  debug(`checking user exists "${userName}"`);
  return new Promise(function(resolve, reject) {
    redisClient.hexists(USERKEY, userName, function (err, data) {
      if (err) reject(err);
      debug(`user "${userName}" hexist with response ${data}`);
      resolve(data);
    })
  });
}

// promise resolves to number for message added where number is count of messages in room
function sendMessage(roomName, userName, msgText) {
  debug(`sending message "${msgText}" to room "${roomName}" from user "${userName}"`);
  return new Promise(function(resolve, reject) {
    let message = {text: msgText,
                   sender: userName,
                   sentTime: Date.now() };
    redisClient.rpush(roomName, JSON.stringify(message), function (err, data) {
      if (err) reject(err);
      debug(`sent "${msgText}" to "${roomName}" from "${userName}"`);
      resolve(data);
    })
  });
}

// promise resolves to array containing message objects
function getMessages(roomName) {
  debug(`requesting messages for "${roomName}"`);
  return new Promise(function(resolve, reject) {
    redisClient.lrange(roomName, 0, -1, function(err,data) {
      if (err) reject(err);
      debug(`messages for room "${roomName}" are "${data}"`);
      let msgList = [];
      data.forEach(function(message) {
        msgList.push(JSON.parse(message));
      });
      resolve(msgList);
    })
  });
}

module.exports = {
  addRoom,
  listRooms,
  addUser,
  getUser,
  isUser,
  sendMessage,
  getMessages
};


/*
sendMessage('test room', 'fred', 'hello world').then(function(data){
  console.log(data);
});
sendMessage('test room', 'george', 'Goodbye cruel world').then(function(data){
  console.log(data);
});
getMessages('test room').then(function(data){
  console.log(data);
});

addUser('fred', {fullname: 'Fred Smith', createDate: Date.now()}).then(function(data){
  console.log(data);
});

getUser('fred').then(function(data){
  console.log(data);
});

getUser('george').then(function(data){
  console.log(data);
});

isUser('fred').then(function(data){
  console.log(data);
});
isUser('george').then(function(data){
  console.log(data);
});

addRoom("test").then(function(data){
  console.log(data);
});
addRoom("test1").then(function(data){
  console.log(data);
});
addRoom("test1").then(function(data){
  console.log(data);
});
listRooms().then(function(data){
  console.log(data);
  process.exit();
});
*/
