const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const io = require('socket.io')(server);

const handlebars = require('express-handlebars');
const port = 3031;

const { 
  createRoom,
  getAllRooms,
  makePost,
  getPostsInRoom
} = require('./services/redis-store');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let username = req.cookies.username;
  if (!username) {
    res.render('registration');
  } else {
    res.redirect('/chatrooms');
  }
});

app.post('/register', (req, res) => {
  let username = req.body.username;
  if (username) {
    res.cookie("username", username);
    res.redirect('/chatrooms');
  } else {
    res.render('registration');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/');
});

app.get('/chatrooms', (req, res) => {
  let username = req.cookies.username;
  if (!username) {
    res.render('registration');
  } else {
    res.render('dashboard', { username });
  }
});

app.post('/createroom', (req, res) => {
  let newRoom = req.body.newroom;
  let username = req.cookies.username;
  let p1 = createRoom(newRoom);
  let p2 = getAllRooms();

  Promise.all([p1, p2]).then(values => {
    let rooms = values[1];
    io.sockets.emit('update rooms', rooms);
    res.redirect('/chatrooms');
  });
});

app.get('/chatroom/:room', (req, res) => {
  let username = req.cookies.username;
  if (!username) res.render('registration');

  let room = req.params.room;
  let p1 = getPostsInRoom(room);

  p1.then(posts => {
    res.render('chatlobby', { username, room });
  });
});

app.post('/chatroom/:room/post', (req, res) =>{
  let username = req.cookies.username;
  let message = req.body.message;
  let room = req.params.room;
  let updateRoomPosts = `update ${ room } posts`;

  let p1 = makePost(message, room, username);
  let p2 = getPostsInRoom(room);

  Promise.all([p1, p2]).then(values => {
    let messages = values[1];
    io.sockets.emit(updateRoomPosts, messages);
    res.redirect(`/chatroom/${ room }`);
  });
});

io.on('connection', client => {
  // Only way I could find to get chatroom path variable available to this function
  let url = client.handshake.headers.referer.split('/');
  let room = decodeURI(url[url.length - 1]);
  let updateRoomPosts = `update ${ room } posts`;

  let p1 = getAllRooms();
  let p2 = getPostsInRoom(room);

  Promise.all([p1, p2]).then(values => {
    let rooms = values[0];
    let messages = values[1];
    client.emit('update rooms', rooms);
    client.emit(updateRoomPosts, messages);
  });

});

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
});