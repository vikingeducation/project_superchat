const redisClient = require("redis").createClient();

var redisClientObject = {
  setUser: function(name) {
    redisClient.LPUSH("users", name);
  },

  getUsers: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("users", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  setRoom: function(name) {
    redisClient.LPUSH("rooms", name);
  },

  getRooms: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("rooms", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  getRoomsMessageLength: function() {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE("rooms", 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  setRoomMessage: function(msg, roomName) {
    redisClient.LPUSH( ("roomMessages" + roomName) , msg);
  },

  getRoomMessages: function(roomName) {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE( ("roomMessages" + roomName), 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  },

  setRoomAuthor: function(name, roomName) {
    redisClient.LPUSH( ("roomAuthors" + roomName) , name);
  },

  getRoomAuthors: function(roomName) {
    return new Promise ((resolve, reject) => {
      redisClient.LRANGE( ("roomAuthors" + roomName), 0, -1, function(err,res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    })
  }



}

module.exports = redisClientObject;
