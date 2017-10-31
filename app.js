const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const { getMessage, addMessage, getAllMessages } = require('./models/message');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const host = 'localhost';
const port = 3000;

app.use('/socket.io', express.static(`${__dirname}node_modules/socket.io-client/dist/`));

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  partialsDir: 'views/',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  getAllMessages((messages) => {
    res.render('index', { messages });
  });
});

app.post('/', (req, res) => {
  const { messageBody } = req.body;
  const room = 'cats';
  const author = 'Anon';
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
