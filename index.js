const express = require('express');
const app = express();

// BODY PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: false }) );

//SOCKET.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

//HANDLEBARS
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( { defaultLayout: 'main' } ));
app.set('view engine', 'handlebars');

//COOKIE PARSER
const cookieParser = require('cookie-parser');
app.use( cookieParser() );

//ASSETS
app.use(express.static(`${__dirname}/public`));

const {
  createMessage,
  createUser,
  createRoom,
  getUserMessages,
  getRoomMessages,
  getRooms,
  clearDatabase,
  getRoomsWithStats,
  getRoomMessagesWithAuthors } = require('./models/model')


app.get('/login', (req, res)=> {
  res.render('login')
});

app.post('/login', (req, res)=> {
  let login = {
    'username': req.body.login } || {};
  createUser(login.username);
  res.cookie('login', login );
  res.redirect('/rooms');
});



app.get('/rooms', async (req, res, next)=> {
  const login = req.cookies.login || {};
  let rooms = await getRooms();
  let allRooms = {};
  console.log('checing rooms ...' + rooms + '...')
  if (rooms.length > 0) {
    console.log('testing');
    allRooms = await getRoomsWithStats();
  }
  try {
    if (!login.username) {
      res.redirect('/login')
    } else {
      console.log('rooms are - in GET' + allRooms['Cooking']);
      res.render('rooms', { login, allRooms })
    }
  } catch(e) {
    next(e);
  }
});

app.get('/rooms/create', async (req, res, next)=> {
  const login = req.cookies.login || {};
  let rooms = await getRooms();
  let allRooms = {};
  console.log('checing rooms ...' + rooms + '...')
  if (rooms.length > 0) {
    let allRooms = await getRoomsWithStats();
  }
  try {
    if (!login.username) {
      res.redirect('/login')
    } else {
      res.render('create_room', { login, allRooms })
    }
  } catch(e) {
    next(e);
  }
});

app.post('/rooms/create', (req, res)=> {
  let login = req.cookies.login || {};
  console.log('what is login' + login)
  console.log('what is login.username' + login.username)
  let roomName = req.body.roomName;
  if (login.username) {
    createRoom(roomName, login.username);
    io.sockets.emit('room', roomName, 1);
    res.redirect('/rooms/' + roomName);
  } else {
    res.redirect('back');
  }
})


app.get('/rooms/:roomName', async (req, res, next)=> {
  const login = req.cookies.login || {};
  let roomName = req.params.roomName;
  let rooms = await getRooms();
  let allRooms = {};
  let roomMessages = {};
  try {
    if (rooms.length > 0) {
      allRooms = await getRoomsWithStats();
    }
    if (!login.username) {
      res.redirect('/login')
    } else {
      if (!roomName || !rooms.includes(roomName) ) {
        res.redirect('/rooms');
      } else {
        let roomMessages = await getRoomMessagesWithAuthors(roomName);
        res.render('chat', { login, allRooms, roomName, roomMessages })
      }
    }
  } catch(e) {
    next(e);
  }
})

app.post('/rooms/:roomName', (req, res)=> {
  let userName = req.cookies.login.username;
  let roomName = req.params.roomName;
  let body = req.body.body;
  createMessage(body, userName, roomName);
  io.sockets.emit('chat', body, userName, roomName);
  res.redirect('back');
})






// io.on('connection', client => {
//   console.log('Client connected...');
//
//   socket.on('chat', async (data)=> {
//     await io.sockets.emit('chat', data);
//   })
//
// });


// app.listen(3000);
server.listen(3000);
