

const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const cp = require('cookie-parser');
var path = require('path');
redisClient = require("redis").createClient(process.env.REDIS_URL);
const {addMessage, getMessagesForRoom, compareTimes} = require('./services/redis/storeMessages')
const {addRoom, getRooms} = require('./services/redis/addRoom');

const port = process.env.PORT || '3000'

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});
app.use(cp())
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
    io.emit('new post', [newPost, username, room]);
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
    getRooms().then(roomNamesArr => {
      roomNamesArr.forEach(roomNamesId => {
        roomNames.push(roomNamesId.substr(5))
      })
      if (!roomNames.length) {
        addRoom("Cats");
        roomNames.push("Cats");
      }
      getMessagesForRoom('Cats').then(messages => {
        console.log(messages);
        messages = messages.sort(compareTimes)
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