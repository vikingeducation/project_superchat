const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const cp = require('cookie-parser');
const path = require('path');
const redisClient = require('./services/redis/createClient');
//Helper Modules
const {addMessage, getMessagesForRoom, compareMessageTimes} = require('./services/redis/messageHandler')
const {addRoom, getRoomIDs} = require('./services/redis/roomHandler');
const checkSuperbot = require('./services/chatbot/superbot.js')
const port = process.env.PORT || '3000'

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cp())

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

io.on("connection", client => {

  client.on("send post", (newPost, username, room) => {
    addMessage(newPost, username, room, Date.now());
    let superBotResponse = checkSuperbot(newPost)
    if (superBotResponse) {
      addMessage(superBotResponse, 'superBot', room, Date.now());
      io.emit('new post', [newPost, username, room], [superBotResponse, 'superBot', room]);
    } else {
      io.emit('new post', [newPost, username, room]);
    }
  });

  client.on("add room", (newRoom) => {
    addRoom(newRoom);
    io.emit('new room', newRoom);
  });

  client.on("change room", (roomName) => {
    getMessagesForRoom(roomName).then(messages => {
        client.emit('change room messages', messages)
      })
  })

});

// redisClient.flushall();

app.get('/', (req, res) => {
  if (!req.cookies.username) {
    res.redirect("/login")
  } else {
    let roomNames = [];
    let username = req.cookies.username;
    getRoomIDs()
    .then(roomIDsArray => {
      roomIDsArray.forEach(roomID => {
        roomNames.push(roomID.substr(5))
      })
      // if (!roomNames.length) {
      //    addRoom("Cats");
      //   roomNames.push("Cats");
      //  }
      getMessagesForRoom('Cats') //Cats is default room
      .then(messages => {
        messages = messages.sort(compareMessageTimes)
        res.render('index', {roomNames, messages, username})
      })
    })
  }
})

app.get('/login', (req, res) => {
  if(req.cookies.username) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

app.post('/login', (req, res) => {
  let username = req.body.newUser;
  res.cookie("username", username)
  res.redirect('/')
})

app.get('/signout', (req, res) => {
  res.clearCookie("username")
  res.redirect('/login')
})

server.listen(port, function(err) {
  console.log(`listening on ${port}`);
});

      //IF FLUSH DATABASE, ADD TO GET '/' TO RENDER HOMEPAGE
      // if (!roomNames.length) {
      //   addRoom("Cats");
      //   roomNames.push("Cats");
      // }