const redis = require('redis');
const redisClient = redis.createClient();

// need a data structure that keeps track of all chatrooms created

const makePost = (message) => {
  let data = {
    author: 'Anonymous',
    text: message,
    date: Date.now(),
    chatroom: 'main'
  };
  return new Promise((resolve, reject) => {
    redisClient.lpush('main', JSON.stringify(data), (err, length) => {
      if (err) {
        reject(err);
      } else {
        resolve(length);
      }
    });
  });
};

const getAllPosts = (chatroom) => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(chatroom, 0, -1, (err, counts) => {
      if (err) {
        reject(err);
      } else {
        resolve(counts);
      }
    });
  });
};

module.exports = {
  getAllPosts,
  makePost
};