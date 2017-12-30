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
  let allRooms = await getRooms();
  try {
    if (!login.username) {
      res.redirect('/login')
    } else {
      res.render('rooms', { login, allRooms })
    }
  } catch(e) {
    next(e);
  }
});

app.get('/rooms/create', async (req, res, next)=> {
  const login = req.cookies.login || {};
  let allRooms = await getRooms();
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
  let login = { 'username': req.body.login } || {};
  let roomName = req.body.roomName;
  createRoom(roomName, login.username);
  io.sockets.emit('room', roomName);
  res.redirect('back');
})




app.get('/room/:roomName', async (req, res, next)=> {
  // clearDatabase();
  const login = req.cookies.login || {};
  let roomName = req.params.roomName;
  let allRooms = await getRooms();
  try {
    if (!login.username) {
      res.redirect('/login')
    } else {
      // console.log(allRooms)
      // console.log('includes functions is: ' + allRooms.includes(roomName) )
      if (!roomName || !allRooms.includes(roomName) ) {
        console.log('in condition');
        res.redirect('/creates');
      } else {
        let roomMessages = await getRoomMessagesWithAuthors(roomName);
        res.render('chat', { login, rooms, roomName, roomName, roomMessages })
      }
    }
  } catch(e) {
    next(e);
  }
})





app.get('/creates', async (req, res, next) => {
  console.log('and in /create am i here?')
  const login = req.cookies.login || {};
  console.log('do we have roomName? - ' + roomName)
  try {
    if (!login.username) {
      res.render('login')
    }
    if (!roomName || !allRooms.includes(roomName) ) {
      let roomMessages = {};
    } else {
      let roomMessages = await getRoomMessagesWithAuthors(roomName);
    }
      res.render('create_room', { login, roomMessages })
  } catch(e) {
    next(e);
  }
})



app.post('/:roomName', (req, res)=> {
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
