var Socket = {};

Socket.setup = (io) => {
  const redis = require("redis");
  const redisClient = redis.createClient();

  // send io for other modules
  Socket.io = io;

  io.on('connection', client => {
    console.log('Socket Connected!');

    client.on('hello', () => {
      console.log('Hello There!!');
    });
  });
};

module.exports = Socket;
