var Socket = {};

Socket.setup = (io) => {
  // send io for other modules
  Socket.io = io;

  const app = require('../app');
  const hbs = app.get('Handlebars');
  const redis = require("redis");
  const redisClient = redis.createClient();
  const randomstring = require('randomstring');

  const generateRandomString = () => {
    return randomstring.generate({
      length: 8,
      charset: 'alphanumeric'
    });
  };

  const createUniqueId = () => {
    return new Promise((resolve, reject) => {
      var string = generateRandomString();

      redisClient.sismember('ids', string, (err, used) => {
        if (used) {
          createShortLink()
          .then((url) => {
            resolve(url);
          });
        } else {
          redisClient.sadd('ids', string);
          resolve(string);
        }
      });
    });
  };

  io.on('connection', client => {

    client.on('new-message', async (info, username) => {
      // generate unique id
      var id = await createUniqueId();

      redisClient.hmset(`messages:general:${ id }`, 'body', info.body, 'createdAt', info.createdAt, 'author', username);
      var partial = await hbs.render(
        'views/partials/message.hbs',
        { body: info.body, createdAt: info.createdAt, author: username, leadingHr: info.leadingHr }
      );

      io.emit('render-message', partial);
    });

    client.on('new-room-name', (roomName, username) => {
      // check if exists
      redisClient.smembers(`room:${ roomName }`, async (err, members) => {
        if (members.length) {
          client.emit('room-name-taken');
        } else {
          redisClient.sadd(`room:${ roomName }`, username);

          // render partial
          var partial = await hbs.render(
            'views/partials/room.hbs',
            { name: `${ roomName }`, memberAmount: 1 }
          );

          io.emit('new-room', partial);
        }
      });
      // create new room
    });
  });
};

module.exports = Socket;
