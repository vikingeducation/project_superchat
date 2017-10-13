var express = require('express');
var router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.cookies.currentUser) {
    res.redirect('/login');
  } else {
    const username = req.cookies.currentUser;

    redisClient.keys('messages:general:*', (err, keys) => {
      var messages = [];

      if (keys.length === 0) {
        res.render('index', { username });
      } else {
        keys.forEach((key) => {
          redisClient.hgetall(key, (err, message) => {

            messages.push(message);

            if (messages.length === keys.length) {
              const sorted = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              res.render('index', { messages: sorted, username });
            }
          });
        });
      }
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

module.exports = router;
