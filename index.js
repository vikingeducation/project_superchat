const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const cp = require('cookie-parser');
redisClient = require("redis").createClient();

const storePost = require('./services/redis/storePost');
const getMessages = require('./services/redis/getMessages');

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});
app.use(cp())
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");



  // redisClient.flushall();

app.get('/', (req, res) => {
  if (!req.cookies.username) {
    res.redirect("/login")
  } else {
    getMessages().then(messages => {
      res.render('index', {messages})
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


server.listen(8000)