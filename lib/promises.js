const client = require('./redis_server');

const promiser = {
  getMessageCounter: () => {
    return new Promise((resolve, reject) => {
      client.get('messageCounter', (err, data) => {
        if (err) {
          console.error(err);
        }
        return resolve(data);
      });
    });
  },

  incrMessageCounter: () => {
    return new Promise((resolve, reject) => {
      client.incr('messageCounter', (err, data) => {
        if (err) {
          console.error(err);
        }
        return resolve(data);
      });
    });
  },

  newMessagePromise: (counter, data) => {
    return new Promise((resolve, reject) => {
      client.hmset('messages', counter, data, (err, data) => {
        if (err) {
          console.error(err);
        }
        return resolve(data);
      });
    });
  },

  hgetAllPromise: hash => {
    return new Promise((resolve, reject) => {
      client.hgetall(hash, (err, data) => resolve(data));
    });
  },

  hmgetPromise: (hash, field) => {
    return new Promise((resolve, reject) => {
      client.hmget(hash, field, (err, data) => resolve(data));
    });
  },

  getRoomCounter: () => {
    return new Promise((resolve, reject) => {
      client.get('roomCounter', (err, data) => {
        if (err) {
          console.error(err);
        }
        return resolve(data);
      });
    });
  },

  newRoomPromise: (counter, room) => {
    return new Promise((resolve, reject) => {
      client.hmset('rooms', counter, room, (err, room) => {
        if (err) {
          console.error(err);
        }
        return resolve(room);
      });
    });
  },

  incrRoomCounter: () => {
    return new Promise((resolve, reject) => {
      client.incr('roomCounter', (err, data) => {
        if (err) {
          console.error(err);
        }
        return resolve(data);
      });
    });
  },

};

module.exports = promiser;