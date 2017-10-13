var express = require('express');
var router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (!req.cookies.currentUser) {
    res.redirect('/login');
  } else {
    const username = req.cookies.currentUser;

    getRooms().then(rooms => {
      redisClient.keys('messages:general:*', (err, keys) => {
        var messages = [];

        if (keys.length === 0) {
          res.render('index', { username, rooms });
        } else {
          keys.forEach((key) => {
            redisClient.hgetall(key, (err, message) => {

              messages.push(message);

              if (messages.length === keys.length) {
                const sorted = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                res.render('index', { messages: sorted, username, rooms });
              }
            });
          });
        }
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
  var username = req.body.username.trim();

  redisClient.sismember('users', username, (err, existing) => {
    if (!existing) {
      redisClient.sadd('users', username);
    }
    res.cookie('currentUser', username);
    res.redirect('/');
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie("currentUser");
  res.redirect('/login');
});

const getRooms = () => {
  return new Promise((resolve, reject) => {
    redisClient.keys('room:*', (err, roomKeys) => {
      var rooms = [];

      roomKeys.forEach(roomKey => {
        redisClient.smembers(roomKey, (err, members) => {
          var name = roomKey.slice(5);

          rooms.push({ name: name, memberAmount: members.length });

          if (rooms.length === roomKeys.length) {
            resolve(rooms);
          }
        });
      });
    });
  });
};

module.exports = router;
