const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const { getRoomMessages, getRooms, createNewRoom, setRoomMessage } = require('./helpers/redis-store.js');


app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.io = io;
  next();
});


io.on('connection', client => {
  console.log('New connection');

  client.on('change room', room => {
    getRoomMessages(room).then(allRoomMessages => {
      client.emit('change room messages', allRoomMessages);
    });
  });

  client.on('message form data', message => {
    const username = message.username;
    const newMessage = message.message;
    const currentRoom = message.room;

    setRoomMessage(newMessage, username, currentRoom).then((data) => {
      io.emit('new message', data);
    });
  });

  client.on('room form data', room => {
    createNewRoom(room).then(room => {
      io.emit('new room', room);
    });
  });
});


app.get('/', (req, res) => {
  let username = req.cookies.username;

  if (username) {
    getRooms().then(rooms => {
      res.render('index', {username, rooms});
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});





server.listen(3000, () => {
  console.log('Listening to port 3000');
});
