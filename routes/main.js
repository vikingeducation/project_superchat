var express = require('express');
var router = express.Router();
let cookierParser = require('cookie-parser');
let bodyParser = require('body-parser');
const redisClient = require('redis').createClient();

// Testing redis object + stringify
let rooms = {
  "1" : {
    }
}
// ------------------------------
redisClient.setnx('rooms', JSON.stringify(rooms));

router.post('/', function(req, res, next){
	res.cookie('username', req.body.user);
	res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  io = require('socket.io')(req.connection.server);

  io.on('connection', client => {

    let message = new Promise((resolve, reject) => {
      redisClient.get('rooms', (err, data) => {
        if (err) return reject(err);
        return resolve(JSON.parse(data, null, 4));
      });
    });

    message
      .then(data => {
        client.emit('loadRooms', data);
      })
      .catch(err => {
        console.error(err);
      });

    client.on('newRoom', newMessage => {
      let master = new Promise((resolve, reject) => {
        console.log(newMessage);
        redisClient.get('rooms', (err, data) => {
          if (err) return reject(err);
          return resolve(JSON.parse(data));
        });
      });
      master
        .then(rooms => {
          let index = (Object.keys(rooms).length + 1).toString();
          rooms[index] = newMessage;
          console.log(rooms, index);
          io.emit('addRoom', newMessage);
          redisClient.set('rooms', JSON.stringify(rooms));
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
	/*(if(!req.cookies){
		req.cookies = {};
	}*/
  let userName = req.cookies.username || 'login';
  console.log(res.cookie);
  res.render('index', {name: userName});
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('', {});
});


module.exports = router;
