const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const { storeMessage, getMessages } = require('./message-store');

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io-client/dist/')
);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const roomName = 'BASIC';
const userName = 'Tyler';

app.get('/', (req, res) => {
  getMessages(roomName).then(values => {
    Promise.all(values)
      .then(messages => {
        console.log(messages);
        res.render('index', { messages: messages });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

app.post('/', (req, res) => {
  let messageBody = req.body.message;
  storeMessage(messageBody, userName, roomName);
  res.redirect('back');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
