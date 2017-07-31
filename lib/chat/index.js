const redis = require("./redis_wrapper");
// const env = require('../../env');

let chat = {
  // Add a new room
  addRoom: function(roomName) {
    return redis.setHash("rooms", roomName, 0);
  },

  // Return a promise that resolves to a list of room names
  getAllRooms: function() {
    return new Promise((resolve, reject) => {
      redis
        .getAllHash("rooms")
        .then(roomObj => {
          roomObj = roomObj || {};
          resolve(Object.keys(roomObj));
        })
        .catch(err => reject(err));
    });
  },

  removeRoom: function(removeRoom) {
    //remove from room hash
    redis.delHash("rooms", removeRoom);
    // delete lists
    redis.delItem(removeRoom);
    return;
  },

  checkRoomName: function(roomName) {
    return new Promise((resolve, reject) => {
      // Get our (ids), counts, and urls
      redis
        .getAllHash("rooms")
        .then(roomObj => {
          if (roomObj) resolve(!roomObj[roomName]);
          else resolve(true);
        })
        .catch(err => reject(err));
    });
  },

  // Add a new message to a room
  // Return a promise that resolves a message object
  addMessage: function(roomName, author, message) {
    return new Promise((resolve, reject) => {
      redis
        .addListArr(roomName, [author, message])
        .then(length => {
          resolve({
            author: author,
            message: message,
            roomName: roomName
          });
        })
        .catch(err => reject(err));
    });
  },

  // Return a promise that resolves an array of message objects
  getMessages: function(roomName) {
    return new Promise((resolve, reject) => {
      redis
        .getAllList(roomName)
        .then(arr => {
          let messages = [];
          for (let i = 0; i < arr.length; i += 2) {
            messages.push({
              author: arr[i],
              message: arr[i + 1],
              roomName: roomName
            });
          }
          resolve(messages);
        })
        .catch(err => reject(err));
    });
  },

  addUser: function(userName) {
    return redis.setHash("users", userName, true);
  },

  // Return a promise
  // that resolves to a boolean that is true of the userName is not taken
  checkUserName: function(userName) {
    return new Promise((resolve, reject) => {
      // Get our (ids), counts, and urls
      redis
        .getAllHash("users")
        .then(usersObj => {
          if (usersObj) resolve(!usersObj[userName]);
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
