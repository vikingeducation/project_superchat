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
);;

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
  getRoomName,
  getUserMessages,
  getRoomMessages,
  getRooms,
  getRoomMessagesWithAuthors } = require('./models/model')
let userId = 0; //before cookies are added



// app.get('/', async (req, res, next)=> {
//   try {
//     let rooms = {'History': 100}; //getRoomStats(roomId)
//     let roomId = 1; // it should be available after choosing my chat room number
//     res.render('chat', { rooms, roomId })
//   } catch(e) {
//     console.log('error');
//     next(e);
//   }
// })

app.get('/:roomId', async (req, res, next)=> {
  const login = req.cookies.login || {};
  try {
    if (!login.username) {
      res.render('login')
    } else {
      let roomId = 1
      // await getUserMessages(0);
      // return
      // let roomId = req.body.roomId;
      console.log('room id in router ' + roomId)
      let roomName = await getRoomName(roomId);
      let roomMessages = await getRoomMessagesWithAuthors(roomId);
      let rooms = {'History': 100}; //getRoomStats(roomId)
      console.log('GET /:ROOMID ' + roomMessages);

      res.render('chat', { login, rooms, roomName, roomId, roomMessages })
    }
  } catch(e) {
    console.log('error');
    next(e);
  }
})

app.post('/login', (req, res)=> {
  let login = {
    'username': req.body.login } || {};
  createUser(login.username);
  res.cookie('login', login );
  res.redirect('back');
})

app.post('/:roomId', (req, res)=> {
  let userName = req.cookies.login.username;
  let roomId = req.params.roomId;
  let body = req.body.body;
  createMessage(body, userName, roomId);
  io.sockets.emit('chat', body, userName, roomId);
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
