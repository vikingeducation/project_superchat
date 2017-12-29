const express = require('express');
const app = express();

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

//ASSETS
app.use(express.static(`${__dirname}/public`));


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
  try {
    let roomId = 1
    // await getUserMessages(0);
    // return
    // let roomId = req.body.roomId;
    console.log('room id in router ' + roomId)
    let roomName = await getRoomName(roomId);
    let roomMessages = await getRoomMessagesByAuthor(roomId);
    let rooms = {'History': 100}; //getRoomStats(roomId)
    console.log('GET /:ROOMID ' + roomMessages)
    // io.sockets.emit('message', roomId, roomMessages);
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

// io.on('connection', client => {
//   console.log('Client connected...');
//
//   socket.on('chat', async (data)=> {
//     await io.sockets.emit('chat', data);
//   })
//
// });


app.listen(3000);
