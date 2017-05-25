const redis = require('redis');
const redisClient = redis.createClient();

// need a data structure that keeps track of all chatrooms created

const makePost = (message, room, username) => {
  let timestamp = new Date();

  let data = {
    author: username,
    text: message,
    date: timestamp.toString(),
    chatroom: 'main'
  };
  return new Promise((resolve, reject) => {
    redisClient.lpush(room, JSON.stringify(data), (err, length) => {
      if (err) {
        reject(err);
      } else {
        resolve(length);
      }
    });
  });
};

const getPostsInRoom = (chatroom) => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(chatroom, 0, -1, (err, posts) => {
      if (err) {
        reject(err);
      } else {
        resolve(posts);
      }
    });
  });
};

const createRoom = (newRoom) => {
  newRoom = newRoom.toLowerCase();
  return new Promise((resolve, reject) => {
    redisClient.sadd("allRooms", newRoom, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getAllRooms = () => {
  return new Promise((resolve, reject) => {
    redisClient.smembers("allRooms", (err, rooms) => {
      if (err) {
        reject(err);
      } else {
        resolve(rooms);
      }
    });
  });
};

module.exports = {
  getPostsInRoom,
  makePost,
  createRoom,
  getAllRooms
};