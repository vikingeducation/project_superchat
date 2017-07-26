const redisClient = require("redis").createClient();
const shortid = require("shortid");

var wrapperStuff = {
  saveMessage: (body, author, room) => {
    var p = new Promise((resolve, reject) => {
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

    return p;
  },

  loadMessages: callback => {
    redisClient.lrange("messages", 0, -1, (err, messages) => {
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

  loadRoomMessages: (roomName, callback) => {
    console.log(roomName);
    redisClient.lrange(roomName, 0, -1, (err, messages) => {
      console.log(messages);
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

  saveUser: user => {
    redisClient.hsetnx("users", user, user);
  },

  saveRoom: roomName => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("rooms", roomName);
      resolve();
    });
  },

  getRooms: () => {
    let p = new Promise((resolve, reject) => {
      redisClient.lrange("rooms", 0, -1, (err, rooms) => {
        resolve(rooms);
      });
    });

    return p;
  }
};

module.exports = wrapperStuff;
