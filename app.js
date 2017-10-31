const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const expressHandlebars = require('express-handlebars');
const { addMessage, getAllMessages } = require('./models/message');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const host = 'localhost';
const port = 3000;

app.use(express.static(`${__dirname}/public`));
app.use('/socket.io', express.static(`${__dirname}node_modules/socket.io-client/dist/`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: config.keys,
}));

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const { name } = req.cookies;
  getAllMessages((messages) => {
    res.render('index', { name, messages });
  });
});

app.get('/signout', (req, res) => {
  res.clearCookie('name');
  res.redirect('/');
});

app.post('/user', (req, res) => {
  const { username } = req.body;
  res.cookie('name', username);
  res.redirect('back');
});

app.post('/message', (req, res) => {
  const { author, messageBody } = req.body;
  const room = 'cats';
  addMessage(room, author, messageBody);
  const message = {
    author,
    body: messageBody,
  };
  io.emit('new message', message);
  res.redirect('back');
});

server.listen(port, () => {
  console.log(`Listening at ${host}:${port}`);
});
