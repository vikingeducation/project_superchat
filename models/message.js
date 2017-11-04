const redisClient = require('redis').createClient();

function addMessage(author, room, body) {
  const message = {
    author,
    room,
    body,
  };
  return new Promise((resolve, reject) => {
    redisClient.rpush(`messages:${room}`, JSON.stringify(message), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function getMessagesForRoom(room) {
  return new Promise((resolve, reject) => {
    redisClient.lrange(`messages:${room}`, 0, -1, (err, messages) => {
      if (err) reject(err);
      resolve(messages);
    });
  });
}

module.exports = {
  addMessage,
  getMessagesForRoom,
};
