const redisClient = require('redis').createClient();
const shortid = require('shortid');


const getRooms = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange('rooms', 0, -1, (err, rooms) => {
      if (err) return console.error(err);

      resolve(rooms);
    });
  });
};

const createNewRoom = (room) => {
  return new Promise((resolve, reject) => {
    redisClient.rpush('rooms', room);

    resolve(room);
  });
};

const getRoomMessages = (room) => {
  return new Promise((resolve, reject) => {
    redisClient.lrange('messages', 0, -1, (err, messageKeys) => {
      if (err) return console.error(err);

      const allMessages = messageKeys.map(key => {
        return getObjFromRedis(key);
      });

      Promise.all(allMessages).then(messages => {
        const roomMessages = messages.filter(message => {
          return message.room === room;
        });

        resolve(roomMessages);
      })
    });
  });
};


const setRoomMessage = (message, username, room) => {
  return new Promise((resolve, reject) => {
    let id = shortid.generate();
    let data = {
      username,
      message,
      room
    };

    redisClient.rpush('messages', `message:${id}`);
    redisClient.hmset(`message:${id}`, data, () => resolve(data));
  });
};


const getObjFromRedis = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(key, (err, obj) => {
      if (err) {
        reject(err);
      }

      resolve(obj);
    });
  });
};



module.exports = {
  getRoomMessages,
  getRooms,
  createNewRoom,
  setRoomMessage
}
