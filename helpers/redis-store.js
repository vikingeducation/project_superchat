const redisClient = require('redis').createClient();
const shortid = require('shortid');

const setMessage = (message) => {
  return new Promise((resolve, reject) => {
    let id = shortid.generate();
    let data = {
      username: 'unknown',
      message: message,
      room: 'cats'
    };

    redisClient.rpush('messages', `message:${id}`);
    redisClient.hmset(`message:${id}`, data, () => resolve(data));
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    redisClient.lrange('messages', 0, -1, (err, messageKeys) => {
      if (err) return console.error(err);

      const messagesDataArr = messageKeys.map(key => {
        return getObjFromRedis(key);
      });

      Promise.all(messagesDataArr).then(arr => {
        resolve(arr);
      })
    });
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
  setMessage,
  getMessages
}
