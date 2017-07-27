const redisClient = require("redis").createClient();
const shortid = require("shortid");

var wrapperStuff = {
  saveMessage: (body, author, room) => {
    return new Promise((resolve, reject) => {
      var messageID = "message-" + shortid.generate();
      redisClient.lpush([room, messageID]);
      redisClient.hmset(messageID, [
        "body",
        body,
        "author",
        author,
        "room",
        room
      ]);
      resolve(true);
    });
  },

  loadRoomMessages: (roomName, callback) => {
    redisClient.lrange(roomName, 0, -1, (err, messages) => {
      messages = messages.map(message => {
        let p = new Promise((resolve, reject) => {
          redisClient.hgetall(message, (err, obj) => {
            let newObj = {
              body: obj.body,
              author: obj.author,
              room: obj.room
            };

            resolve(newObj);
          });
        });
        return p;
      });

      Promise.all(messages).then(resolvedMessages => {
        callback(resolvedMessages);
      });
    });
  },

  saveRoom: user => {
    return new Promise((resolve, reject) => {
      redisClient.hsetnx("users", user, user);
      resolve();
    });
  },

  saveUser: user => {
    return new Promise((resolve, reject) => {
      redisClient.hsetnx(`user-${user}`, "main-room", "main-room");
      resolve();
    });
  },

  saveRoom: (user, roomName) => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("rooms", roomName);
      redisClient.hsetnx(`user-${user}`, roomName, roomName);
      resolve();
    });
  },

  leaveRoom: (user, roomName) => {
    return new Promise((resolve, reject) => {
      redisClient.hdel(`user-${user}`, roomName);
      resolve();
    });
  },

  getRooms: user => {
    return new Promise((resolve, reject) => {
      redisClient.lrange(`user-${user}`, 0, -1, (err, rooms) => {
        resolve(rooms);
      });
    });
  }
};

module.exports = wrapperStuff;
