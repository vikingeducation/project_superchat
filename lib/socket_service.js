

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

    client.on('new-message', async (info) => {
      // generate unique id
      var id = await createUniqueId();

      redisClient.hmset(`messages:general:${ id }`, 'body', info.body, 'createdAt', info.createdAt);
      var partial = await hbs.render(
        'views/partials/message.hbs',
        { body: info.body, createdAt: info.createdAt, leadingHr: info.leadingHr }
      );

      io.emit('render-message', partial);
    });
  });
};

module.exports = Socket;
