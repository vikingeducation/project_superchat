const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');
const { addMessage, getMessagesForRoom } = require('./models/message');
const { addRoom, getAllRooms } = require('./models/room');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const host = 'localhost';
const port = 3000;

app.use(express.static(`${__dirname}/public`));
app.use('/socket.io', express.static(`${__dirname}node_modules/socket.io-client/dist/`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const { name } = req.cookies;
  const p = getAllRooms();
  p.then((rooms) => {
    res.render('index', { name, rooms });
  });
});

app.get('/signout', (req, res) => {
  res.clearCookie('name');
  res.redirect('/');
});

app.post('/user', (req, res) => {
  const { username } = req.body;
  res.cookie('name', username);
  res.redirect('/');
});

app.post('/room', (req, res) => {
  const { room } = req.body;
  const p = addRoom(room);
  p.then(() => {
    io.emit('new room', room.toLowerCase());
    res.redirect('back');
  });
});

app.get('/rooms/:room', (req, res) => {
  const { name } = req.cookies;
  const { room } = req.params;
  const p1 = getAllRooms();
  const p2 = getMessagesForRoom(room);
  Promise.all([p1, p2]).then((values) => {
    const rooms = values[0];
    const messages = values[1].map(JSON.parse);
    res.render('index', {
      name,
      rooms,
      room,
      messages,
    });
  });
});

app.post('/rooms/:room/message', (req, res) => {
  const { author, messageBody } = req.body;
  const { room } = req.params;
  addMessage(author, room, messageBody);
  const message = {
    author,
    room,
    body: messageBody,
  };
  io.emit('new message', message);
  res.redirect('back');
});

server.listen(port, () => {
  console.log(`Listening at ${host}:${port}`);
});
