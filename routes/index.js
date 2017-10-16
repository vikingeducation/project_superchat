const express = require('express');
const router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();

/* GET home page. */
router.get('/', (req, res, next) => {
  redisClient.keys('*', (err, keys) => {
    console.log(keys);
  });

  if (!req.cookies.currentUser) {
    res.redirect('/login');
  } else {
    var chatRoom = req.cookies.chatRoom;
    if (!chatRoom) {
      chatRoom = 'General';
    }
    chatRoom = chatRoom.split(' ').join('-');

    const username = req.cookies.currentUser;

    getRooms(chatRoom).then(rooms => {
      redisClient.keys(`messages:${chatRoom}:*`, (err, keys) => {
        var messages = [];

        checkUserMember(chatRoom, username).then(isMember => {

          if (keys.length === 0) {
            res.render('index', { username, rooms, chatRoomName: chatRoom.split('-').join(' '), chatRoom, isMember });
          } else {
            keys.forEach((key) => {
              redisClient.hgetall(key, (err, message) => {

                messages.push(message);

                if (messages.length === keys.length) {
                  const sorted = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                  chatRoomName = chatRoom.split('-').join(' ');
                  res.render('index', { messages: sorted, username, rooms, chatRoomName, chatRoom, isMember });
                }
              });
            });
          }
        });
      });
    });
  }
});

router.get('/login', (req, res) => {
  if (req.cookies.currentUser) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  const io = require('../bin/www');

  var username = req.body.username.trim();

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
    res.cookie('currentUser', username);
    res.redirect('/');
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie("currentUser");
  res.redirect('/login');
});

const getRooms = (chatRoom) => {
  return new Promise((resolve, reject) => {
    redisClient.smembers('users', (err, list) => {

      var totalUsers = list.length;

      redisClient.keys('room:*', (err, roomKeys) => {
        var rooms = [];

        if (!roomKeys.length) {
          resolve(rooms);
        }

        roomKeys.forEach(roomKey => {
          redisClient.smembers(roomKey, (err, members) => {

            var slug = roomKey.slice(5);
            var name = slug.split('-').join(' ');

            if (slug == chatRoom) {
              rooms.push({ name: name, memberAmount: members.length, active: 'active', slug: slug });
            } else {
              rooms.push({ name: name, memberAmount: members.length, slug: slug });
            }

            if (rooms.length === roomKeys.length) {
              resolve(rooms);
            }
          });
        });
      });
    });
  });
};

const checkUserMember = (room, user) => {
  return new Promise((resolve, reject) => {
    redisClient.sismember(`room:${ room }`, user, (err, isMember) => {
      resolve(isMember);
    });
  });
};

module.exports = router;
