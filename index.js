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

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.get('/', (req, res) => {
  // redisClient.keys('messages:*', (err, keys) => {
  //   if (err) throw err;
  //   console.log(keys)
  // })
  // redisClient.flushall();
  var messages = getMessages();
  // console.log('messages ', messages);
  res.render('index')
})

app.post('/update', (req, res) => {
  let post = req.body.newPost;
  storePost(post);
  res.redirect('/')
})


server.listen(8000)