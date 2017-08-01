const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const expressHandlebars = require('express-handlebars');
const hbsHelpers = require('./helpers/handlebars-helpers');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { storeMessage, getMessages } = require('./message-store');

app.engine(
  'handlebars',
  expressHandlebars({ defaultLayout: 'main', helpers: hbsHelpers })
);
app.set('view engine', 'handlebars');

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io-client/dist/')
);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const roomName = 'BASIC';

app.get('/', (req, res) => {
  if (req.cookies.username) {
    getMessages(roomName).then(values => {
      Promise.all(values)
        .then(messages => {
          console.log(messages);
          res.render('index', {
            messages: messages,
            username: req.cookies.username
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  res.cookie('username', username);
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

app.post('/', (req, res) => {
  let messageBody = req.body.message;
  let username = req.cookies.username;
  storeMessage(messageBody, username, roomName);
  io.sockets.emit('new message', {
    body: messageBody,
    author: username,
    room: roomName
  });
  res.redirect('back');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
