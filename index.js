const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { newPost, getAllPosts } = require('./redisDataStore');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const hbs = expressHandlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let username = req.cookies.username;
  if (!username) {
    res.render('user');
  } else {
    res.render('index', {username});
  }
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  if (username) {
    res.cookie("username", username);
    res.redirect('/');
  } else {
    res.render('user');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/');
});

app.post('/update', (req, res) =>{
  let username = req.cookies.username;
  let message = req.body.newPost;
  let p1 = newPost(message, username);
  let p2 = getAllPosts('Main');

  Promise.all([p1, p2]).then(values => {
    let messages = values[1];
    io.sockets.emit('new message', messages);
    res.end();
  });
});

io.on('connection', client => {
  let p1 = getAllPosts('Main');

  p1.then(messages => {
    client.emit('new message', messages);
  });
});

server.listen(4700, () => {
  console.log("Check out my awesome Super Chat app  at localhost:4700 !!");
});
