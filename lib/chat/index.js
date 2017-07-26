const redis = require('./redis_wrapper');
// const env = require('../../env');

let chat = {
  // Add a new room
  addRoom: function(roomName) {
    return redis.setHash('rooms', roomName, 0);
  },

  // Add a new message to a room
  addMessage: function(roomName, author, message) {
    return redis.addToList(roomName, author, message);
  },

  // Get all the messages from a room
  getMessages: function(roomName) {
    return redis.getAllList(roomName);
  },

  // Return a promise
  // that resolves to a boolean that is true of the userName is not taken
  checkUserName: function(userName) {
    return new Promise((resolve, reject) => {
      // Get our (ids), counts, and urls
      redis
        .getAllHash('users')
        .then(usersObj => {
          if (usersObj) resolve(!Object.keys(usersObj).includes(userName));
          else resolve(true);
        })
        .catch(err => reject(err));
    });
  },

  // Remove a user from the database, resolve boolean
  removeUser: function(userName) {
    return redis.delHash(userName);
  }
};

// for later...
// Add a user to a room
// Remove a user from a room

//   // Add a given url to the redis store
//   // return promises that resolve to the url and count objects
//   shorten: function(url) {
//     // Create id
//     let id = shortid();
//     // Insert url and count into hashes
//     return new Promise((resolve, reject) => {
//       Promise.all([redis.set("counts", id, 0), redis.set("urls", id, url)])
//         .then(([countObj, urlObj]) => {
//           resolve(_buildIds(countObj, urlObj)[0]);
//         })
//         .catch(err => reject(err));
//     });
//   },

//   // Increment the count for a given id,
//   // Return a promise that resolve to its url object
//   update: function(id) {
//     return new Promise((resolve, reject) => {
//       Promise.all([redis.incr("counts", id), redis.get("urls", id)])
//         .then(([countObj, urlObj]) => {
//           resolve(_buildIds(countObj, urlObj)[0]);
//         })
//         .catch(err => reject(err));
//     });
//   },

// // Return an array of id objects given counts and urls objects
// function _buildIds(countsObj, urlsObj) {
//   let urls = [];
//   for (let id in countsObj) {
//     // Qualify our local links
//     let qualified = `http://${env.hostname}:${env.port}/s/${id}`;
//     urls.push({
//       url: qualified,
//       count: countsObj[id],
//       originalUrl: urlsObj[id],
//       id: id
//     });
//   }
//   return urls;

module.exports = chat;
