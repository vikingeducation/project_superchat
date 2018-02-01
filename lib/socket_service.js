var Socket = {};

Socket.setup = (io) => {
  const app = require('../app');
  const hbs = app.get('Handlebars');
  const RedisHelper = require('../helpers/RedisHelper');
  const redisClient = RedisHelper.createClient();
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

      var room = info.room.split(' ').join('-');

      redisClient.hmset(`messages:${ room }:${ id }`, 'body', info.body, 'createdAt', info.createdAt, 'author', username, 'room', info.room );
      var partial = await hbs.render(
        'views/partials/message.hbs',
        { body: info.body, createdAt: info.createdAt, author: username, leadingHr: info.leadingHr }
      );

      io.emit('render-message', partial, room);
    });

    client.on('new-room-name', (roomName, username) => {
      var slug = roomName.trim().split(' ').join('-');
      // check if exists
      redisClient.smembers(`room:${ slug }`, async (err, members) => {
        if (members.length) {
          client.emit('room-name-taken');
        } else {
          redisClient.sadd(`room:${ slug }`, username);

          // render partial
          var partial = await hbs.render(
            'views/partials/room.hbs',
            { name: `${ roomName }`, memberAmount: 1, slug: slug }
          );

          io.emit('new-room', partial);
        }
      });
    });

    client.on('join-user', async (room, username) => {
      await redisClient.sadd(`room:${ room }`, username);
      handleMemberCounts(room);
    });

    client.on('leave-user', async (room, username) => {
      await redisClient.srem(`room:${ room }`, username);
      handleMemberCounts(room);
    });

    const handleMemberCounts = room => {
      redisClient.smembers(`room:${ room }`, (err, members) => {
        var memberCount = members.length;
        client.emit('refresh');
        io.emit('change-member-count', room, memberCount);
      });
    };
  });
};

module.exports = Socket;
