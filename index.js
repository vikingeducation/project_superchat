const express = require('express');
const app = express();
const router = express.Router();
const server = require('http').createServer(app);
const exphbs = require('express-handlebars');
const client = require('./lib/redis_server.js');
const bodyParser = require('body-parser');
const promises = require('./lib/promises.js');
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

let count = 0;

app.get('/', (req, res) => {
  if (!req.cookies.userName) {
    res.redirect('/login');
  }
  console.log(req.cookies.userName);
  let params = [];
  promises
    .hgetAllPromise('messages')
    .then(data => {
      let keys = Object.keys(data);
      keys.forEach(key => {
        let json = JSON.parse(data[key]);
        params.push(json);
      });
    })
    .then(data => {
      console.log(params);
      let paramsObj = {};
      paramsObj.messages = params;
      res.render('home', paramsObj);
    });
});

app.get('/login', (req, res) => {
  res.render('login');
});

client.setnx('messageCounter', 0);

app.post('/', (req, res) => {
  let newMessage = req.body.newMessage;

  res.redirect('back');
});

app.post('/login', (req, res) => {
  res.cookie('userName', req.body.userName);
  console.log(res.cookies.userName);
  res.redirect('/');
});

io.on('connection', client => {
  client.on('newMessage', message => {
    let obj;
    promises
      .incrMessageCounter()
      .then(promises.getMessageCounter)
      .then(counter => {
        obj = { body: message, postedBy: 'Anon', room: 'Cats' };
        let strObj = JSON.stringify(obj);
        return promises.newMessagePromise(counter, strObj);
      })
      .then(data => {
        io.emit('addMessage', obj);
      })
      .catch(console.error);
  });
});

//Start server
server.listen(3000);
