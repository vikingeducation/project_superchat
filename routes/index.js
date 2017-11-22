var express = require('express');
var router = express.Router();
let io;

const redisClient = require('redis').createClient();


// Testing redis object + stringify
/*
let rooms = {
  "1" : {
    "1": {
      body: "some stuff",
      author: "Gene",
      room: "1"
    }
  }
}
*/
// ------------------------------


/* GET home page. */
router.get('/', function(req, res, next) {
  io = require('socket.io')(req.connection.server);

  io.on('connection', client => {
    console.log('connection up');

    let message = new Promise((resolve, reject) => {
      redisClient.get('rooms', (err, data) => {
        if (err) return reject(err);
        return resolve(JSON.parse(data, null, 4));
      });
    });

    message
      .then(data => {
        client.emit('loadMessages', data);
      })
      .catch(err => {
        console.error(err);
      });

  });

  res.render('index', {title: 'Express'});
});

module.exports = router;
