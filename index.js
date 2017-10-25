const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { newPost, getAllPosts, newRoom, getAllRooms, getNumRoomUsers } = require('./redisDataStore');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const hbs = expressHandlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(express.static(__dirname + '/public'));

let Chatroom = '';  // global 

app.get('/', (req, res) => {
  let username = req.cookies.username;
  let chatroom = 'Main';
  if (req.cookies.chatroom) {
    chatroom = req.cookies.chatroom;
  }

  // console.log("chatroom: " + chatroom);
  res.cookie("chatroom", chatroom);

  Chatroom = chatroom;
  if (!username) {
    res.render('user');
  } else {
    getAllPosts(chatroom).then(messages => {
      io.sockets.emit('new message', messages)
      res.render('index', { username, chatroom });
    });
  }
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  if (username) {
    res.cookie("username", username);
    res.redirect('/');
  } else {
    res.render('user');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/');
});

app.get('/newroom', (req, res) => {
  let username = req.cookies.username;
  if (!username) {
    res.render('user');
  } else {

    // Tried to get number of members of each room and send it to chatroom page
    // Learnt to use Promise.all with .map instead of 
    // forEach (does not return anything, so doesn't work in .all)
    
    // Also learnt: roomCounts.map(([name, num]) => ({ name, num })) looks better than
    // roomCounts.map((roomObj) => ({ name: roomObj[0], num: roomObj[1] }))

    getAllRooms().then(chatrooms => {
      Promise
        .all(chatrooms.map((room) => getNumRoomUsers(room)))
        .then((roomCounts) => {
          const rooms = roomCounts.map(([name, num]) => ({ name, num }));
          res.render('chatroom', { rooms, Chatroom });
        });       
    });
  }
});

app.post('/addroom', (req, res) => {
  let room = req.body.newroom;
  let p1 = newRoom(room);
  let p2 = getAllRooms();

  Promise.all([newRoom(room), p2]).then(values => {
    let rooms = values[1];
    io.sockets.emit('update rooms', rooms);
  });

  p2.then(chatrooms => {
      Promise
        .all(chatrooms.map((room) => getNumRoomUsers(room)))
        .then((roomCounts) => {
          const rooms = roomCounts.map(([name, num]) => ({ name, num }));
          res.render('chatroom', { rooms, Chatroom });
        });     
    });
});


app.post('/chatroom/:room/update', (req, res) => {
  let username = req.cookies.username;
  let message = req.body.newPost;
  let chatroom = req.params.room;

  let p1 = newPost(message, username, chatroom);
  let p2 = getAllPosts(chatroom); 

  // console.log("In update, chatroom: " + chatroom);
  Promise.all([p1, p2]).then(values => {
    let messages = values[1];
    io.sockets.emit('new message', messages);
    res.end();
  });
});

app.get('/chatroom/:room', (req, res) => {
  let username = req.cookies.username;
  if (!username) res.render('user');

  let chatroom = req.params.room;
  res.cookie("chatroom", chatroom);
  Chatroom = chatroom;

  // console.log("In chatroom/:room, chatroom: " + Chatroom);

  getAllPosts(chatroom).then(messages => {
    io.sockets.emit('new message', messages);
    res.render('index', { username, chatroom });
  });
});

io.on('connection', client => {
  // console.log('In connection: ' + Chatroom);
  if (!Chatroom) Chatroom = "Main";

  getAllPosts(Chatroom).then(messages => {
    client.emit('new message', messages);
  });
});

server.listen(4700, () => {
  console.log("Check out my awesome Super Chat app  at localhost:4700 !!");
});
