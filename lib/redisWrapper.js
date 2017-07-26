const redisClient = require("redis").createClient();
const shortid = require("shortid");

var wrapperStuff = {
  saveMessage: (body, author, room) => {
    var p = new Promise((res, rej) => {
      var messageID = "message-" + shortid.generate();
      redisClient.lpush(["messages", messageID]);
      redisClient.hmset(messageID, [
        "body",
        body,
        "author",
        author,
        "room",
        room
      ]);

      res(true);
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
  }
};

module.exports = wrapperStuff;
