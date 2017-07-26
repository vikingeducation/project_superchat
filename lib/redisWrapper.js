const redisClient = require("redis").createClient();
// client = redis.createClient();

var wrapperStuff = {
  saveMessage: (body, author, room) => {
    // messageID = generate a unique id
    redisClient.rpushx("messages", messageID);
    redisClient.hmset(messageID, [
      "body",
      body,
      "author",
      author,
      "room",
      room
    ]);
  },

  loadMessages: messageIDs => {
    let messageIDs = redisClient.lget("messages", messages => {
      messages.map(message => {
        let obj = (message = {});
      });
    });

    // messageIDs.forEach((id)=> {
    // 	messages = redisClient.keys(`message:${i}`);
    // })

    console.log(messages);
  },

  addRoom: () => {},

  addUser: () => {}
};

module.exports = wrapperStuff;
