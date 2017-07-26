const redisClient = require("redis").createClient();
// client = redis.createClient();

var wrapperStuff = {
  saveMessage: (body, author, room) => {
    messageID = "message-2"
    redisClient.rpush(["messages", messageID]);
    redisClient.hmset(messageID, [
      "body",
      body,
      "author",
      author,
      "room",
      room
    ]);
  },

  loadMessages: (callback) => {
    redisClient.lrange("messages", 0, -1, (err, messages) => {
      console.log(messages);

      messages = messages.map((message) => {
        let p = new Promise((resolve, reject) => {
          redisClient.hgetall(message, (err, obj) => {
            let newObj = {};
            newObj[message] = {
              body: obj.body,
              author: obj.author,
              room: obj.room
            }

            resolve(newObj);
          });
        });

        return p
      });

      console.log(messages);

      Promise.all(messages).then((resolvedMessages) => {
        callback(resolvedMessages);
      });
    });
  }
};

module.exports = wrapperStuff;
