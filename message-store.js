const redis = require('redis');
const redisClient = redis.createClient();

const storeMessage = (messageBody, authorName, roomName) => {
  let messageID = Date.now();
  let messageHashName = 'message:' + messageID;
  let roomListName = 'room:' + roomName;
  console.log(
    'Message hash name: ' +
      messageHashName +
      ', Message: ' +
      messageBody +
      ', Author: ' +
      authorName +
      ', Room: ' +
      roomName
  );
  redisClient.hmset(
    messageHashName,
    'body',
    messageBody,
    'author',
    authorName,
    'room',
    roomName
  );
  redisClient.lpush(roomListName, messageHashName);
};

const getMessageIDs = roomName => {
  let roomListName = 'room:' + roomName;
  return new Promise((resolve, reject) => {
    redisClient.lrange(roomListName, 0, 20, (err, messageIDs) => {
      if (err) {
        reject(err);
      } else {
        // console.log(messageIDs);
        resolve(messageIDs);
      }
    });
  });
};

const getMessageByID = messageID => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(messageID, (err, messageObject) => {
      if (err) {
        reject(err);
      } else {
        // console.log(messageObject);
        resolve(messageObject);
      }
    });
  });
};

const getMessages = roomName => {
  //array of promises containing message bodies
  return new Promise((resolve, reject) => {
    var messages = [];
    getMessageIDs(roomName)
      .then(messageIDsList => {
        messageIDsList.forEach(messageID => {
          var p = getMessageByID(messageID);
          messages.push(p);
        });
        // console.log(messages);
        resolve(messages);
      })
      .catch(error => {
        // console.error(error);
        reject(error);
      });
  });
};

const addRoom = roomName => {
  redisClient.sadd('rooms', roomName);
};

const getRoomNames = () => {
  return new Promise((resolve, reject) => {
    redisClient.smembers('rooms', (err, roomNames) => {
      if (err) {
        reject(err);
      } else {
        resolve(roomNames);
      }
    });
  });
};

module.exports = {
  storeMessage,
  getMessages,
  addRoom,
  getRoomNames
};
