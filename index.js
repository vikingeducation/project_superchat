const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const cp = require('cookie-parser');
redisClient = require("redis").createClient();

const storePost = require('./services/redis/storePost');
const getValues = require('./services/redis/getMessages');
const addRoom = require('./services/redis/addRoom');

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});
app.use(cp())
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");



  //redisClient.flushall();

app.get('/', (req, res) => {
  if (!req.cookies.username) {
    res.redirect("/login")
  } else {
    let messagesArr = [];
    let roomsArr = [];
    getValues('messages:*').then(messages => {
      messagesArr = messages;
      getValues('rooms:*').then(rooms => {
        roomsArr = rooms;
        res.render('index', {messagesArr, roomsArr})
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

app.post('/update', (req, res) => {
  let post = req.body.newPost;
  let username = req.cookies.username;
  storePost(post, username);
  res.redirect('/')
})

app.get('/newroom', (req, res) => {
  res.render('newroom')
})

app.post('/updaterooms', (req, res) => {
  let room = req.body.newRoom;
  addRoom(room);
  res.redirect('/')
})

app.get('/room/:roomName', (req, res) => {
  let roomName = req.params.roomName;
  
})


server.listen(8000)