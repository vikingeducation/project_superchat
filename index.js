const express = require('express');
const app = express();

// REDIS
// const redis = require('redis');
// const redisClient = redis.createClient();
// redisClient.on('connect', ()=> {
//   console.log('connected to Redis');
// })


const {
  createMessage,
  createUser,
  createRoom,
  getUserName,
  getRoomName,
  getUserMessages,
  getRoomMessages,
  getRooms,
  getRoomMessagesByAuthor } = require('./models/model')

let userId = 0; //before cookies are added
// BODY PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true}) );

//SOCKET.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

//HANDLEBARS
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( { defaultLayout: 'main' } ));
app.set('view engine', 'handlebars');

//ASSETS
app.use(express.static(`${__dirname}/public`));


app.get('/', async (req, res, next)=> {
  try {
    let rooms = {'History': 100}; //getRoomStats(roomId)
    res.render('chat', { rooms })
  } catch(e) {
    console.log('error');
    next(e);
  }
})

app.get('/:roomId', async (req, res)=> {
  try {
    let roomId = req.params.roomId;
    let roomName = await getRoomName(roomId);
    let roomMessages = await getRoomMessagesByAuthor(roomId);
    let rooms = {'History': 100}; //getRoomStats(roomId)
    console.log('in get messages are: ' + roomMessages)
    io.sockets.emit('message', roomId, roomMessages);
    res.render('chat', { rooms, roomName, roomId, roomMessages })
  } catch(e) {
    console.log('error');
    next(e);
  }
})

app.post('/:roomId', (req, res)=> {
  let roomId = req.params.roomId;
  let body = req.body.body;
  createMessage(body, userId, roomId);
  res.redirect('back');
})

io.on('connection', async (client) => {
  console.log('Client connected...');

  client.on('join', function(data) {
      console.log(data);
  });

});


app.listen(3000);
