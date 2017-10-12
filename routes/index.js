var express = require('express');
var router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  redisClient.keys('messages:general:*', (err, keys) => {
    var messages = [];

    if (keys.length === 0) {
      res.render('index');
    } else {
      keys.forEach((key) => {
        redisClient.hgetall(key, (err, message) => {

          messages.push(message);

          if (messages.length === keys.length) {
            const sorted = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            res.render('index', { messages: sorted });
          }
        });
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
