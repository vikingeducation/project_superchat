const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const ra = require('./lib/ra');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

io.on('connection', client => {
  client.on('postMessage', newMessage => {
    let user = client.username;
    ra.postMessage(client, newMessage);

    io.emit('newMessage', newMessage, user);
  });

  client.on('signUp', newUser => {
    ra.getUserList(client, newUser);
  });
});

app.get('/', (req, res) => {
  ra.getAllMessages().then(messageList => {
    res.render('index', { messageList });
  });

  //res.render('index', { messageList });
});

// function renderHomePage(messageList) {
//
// }

server.listen(3000);

module.exports = {
  //renderHomePage
};

//var p = ra.getAllMessages();

// let messagesObj = {};
//
// var p = new Promise(function(resolve, reject) {
//   redisClient.keys('message_*', (err, keys) => {
//     //console.log(keys);
//     if (keys.length === 0) {
//       resolve(messagesObj);
//     }
//
//     keys.forEach(key => {
//       redisClient.hgetall(key, (err, message) => {
//         messagesObj[key] = message;
//         //console.log(Object.keys(messagesObj).length);
//         //console.log(keys.length);
//         if (Object.keys(messagesObj).length === keys.length) {
//           resolve(messagesObj);
//         }
//       });
//     });
//   });
//  });

// p.then(messageList => {
//   res.render('index', { messageList });
// });
//
// function renderHomePage(messageList) {
//   res.render('index', { messageList });
// }
