const redisClient = require('redis').createClient();

function _incrementMessageId() {
  return new Promise((resolve, reject) => {
    redisClient.incr('msgCount', (err, reply) => {
      if (err) reject(err);
      resolve(reply);
    });
  });
}

function _getMessagesForRoom(room) {
  return new Promise((resolve, reject) => {
    redisClient.lrange(`room:${room}`, 0, -1, (err, reply) => {
      if (err) reject(err);
      resolve(reply);
    });
  });
}

// function getMessage(msgId) {
//   return new Promise((resolve, reject) => {
//     redisClient.hgetall(`msg:${msgId}`, (err, reply) => {
//       if (err) reject(err);
//       resolve(reply);
//     });
//   });
// }

async function addMessage(room, author, message) {
  const msgId = await _incrementMessageId();
  redisClient.hmset(`msg:${msgId}`, 'author', author, 'room', room, 'body', message);
  redisClient.rpush(`room:${room}`, msgId);
}

async function getAllMessages(callback) {
  const msgList = await _getMessagesForRoom('cats');
  const messages = [];
  const p = new Promise((resolve, reject) => {
    msgList.forEach((msgId) => {
      redisClient.hgetall(`msg:${msgId}`, (err, reply) => {
        if (err) reject(err);
        messages.push(reply);
      });
    });
    resolve();
  });
  p.then(() => {
    callback(messages);
  });
}

module.exports = {
  addMessage,
  getAllMessages,
};
