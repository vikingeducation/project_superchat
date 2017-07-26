const redis = require("./redis_wrapper");
// const env = require('../../env');

let chat = {
  // Add a new room
  addRoom: function(roomName) {
    return redis.setHash("rooms", roomName, 0);
  },

  // Add a new message to a room
  addMessage: function(roomName, author, message) {
    return redis.addToList(roomName, author, message);
  },

  // Get all the messages from a room
  getMessages: function(roomName) {
    return redis.getAllList(roomName);
  },
  addUser: function(userName) {
    return redis.setHash("users", userName, userName);
  },

  // Return a promise
  // that resolves to a boolean that is true of the userName is not taken
  checkUserName: function(userName) {
    return new Promise((resolve, reject) => {
      // Get our (ids), counts, and urls
      redis
        .getAllHash("users")
        .then(usersObj => {
          if (usersObj) resolve(!Object.values(usersObj).includes(userName));
          else resolve(true);
        })
        .catch(err => reject(err));
    });
  },

  // Remove a user from the database, resolve boolean
  removeUser: function(userName) {
    return redis.delHash("users", userName);
  }
};

module.exports = chat;
