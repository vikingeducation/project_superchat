const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const { getMessages, setMessage } = require('./helpers/redis-store.js');


app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.io = io;
  next();
});


io.on('connection', client => {
  console.log('New connection');
});



app.get('/', (req, res) => {
  let username = req.cookies.username;

  if (username) {
    getMessages().then(allMessages => {
      res.render('index', {allMessages, username});
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/posts/new', (req, res) => {
  let io = req.io;
  let username = req.cookies.username;
  let newMessage = req.body.message;

  setMessage(newMessage, username).then((data) => {
    io.emit('new message', data);
    res.redirect('back');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});


server.listen(3000, () => {
  console.log('Listening to port 3000');
});
