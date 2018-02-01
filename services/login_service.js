const RedisHelper = require('../helpers/redisHelper');
const redisClient = RedisHelper.createClient();

var Login = {};

Login.addUser = username => {
  const io = require('../bin/www');

  return new Promise((resolve, reject) => {
    redisClient.sismember('users', username, (err, existing) => {
      if (!existing) {
        redisClient.sadd('users', username);
        redisClient.sadd('room:General', username);

        io.on('connection', client => {
          redisClient.smembers('room:General', (err, members) => {
            var memberCount = members.length;
            io.emit('change-member-count', 'General', memberCount);
          });
        });
      }
      resolve();
    });
  });
};

module.exports = Login;

