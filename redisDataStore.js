const redis = require('redis');
const redisClient = redis.createClient();

// redisClient.del('Main');
// redisClient.del('AllRooms');

const newPost = (message, username, chatroom) => {
  let post = {
    user: username,
    text: message,
    date: Date.now(),
    chatroom: chatroom
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
        // console.log("getAllPosts: " + data + " chatroom: " + chatroom);
        resolve(data);
      }
    });
  });
};

const newRoom = (chatroom) => {
  room = chatroom.charAt(0).toUpperCase() + chatroom.slice(1);
  return new Promise((resolve, reject) => {
    redisClient.sadd("AllRooms", room, (err) => {
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
    redisClient.smembers("AllRooms", (err, rooms) => {
      if (err) {
        reject(err);
      } else {
        resolve(rooms);
      }
    });
  });
};


module.exports = {
  newPost,
  getAllPosts,
  newRoom, 
  getAllRooms
};
