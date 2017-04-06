const shortid = require('shortid');
const redisClient = require('./createClient');


function addMessage(body, username, room, time) {
  const id = shortid.generate();
  redisClient.hmset(`messages:${id}`, { body, username, room, time });
  redisClient.lpush(`rooms:${room}`, id);
}

function getMessagesForRoom(room) {
  return getMessageKeysForRoom(room).then(getMessages);
}

function getMessageKeysForRoom(room) {
  return new Promise(resolve => {
    redisClient.lrange(`rooms:${room}`, 0, -1, (err, messageKeys) => {
      resolve(messageKeys);
    });
  });
}

function getMessage(key) {
  return new Promise(resolve => {
    redisClient.hgetall(`messages:${key}`, (err, message) => {
      resolve(message);
    });
  });
}

function getMessages(keys) {
  return Promise.all(keys.map(getMessage));
}

function compareMessageTimes(a,b) {
  if (a.time < b.time)
    return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}

module.exports = {
  addMessage,
  getMessagesForRoom,
  compareMessageTimes
}
