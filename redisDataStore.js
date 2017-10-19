const redis = require('redis');
const redisClient = redis.createClient();

// redisClient.del('Main');

const newPost = (message) => {
  let post = {
    user: 'Maddie',
    text: message,
    date: Date.now(),
    chatroom: 'Main'
  };
  return new Promise((resolve, reject) => {
    redisClient.lpush(post.chatroom, JSON.stringify(post), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getAllPosts = (chatroom) => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(chatroom, 0, -1, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  newPost,
  getAllPosts
};
