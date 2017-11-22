const express = require('express');
const app = express();
const router = express.Router();
const server = require('http').createServer(app);
const exphbs = require('express-handlebars');
const redis = require('redis');
const client = redis.createClient();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const io = require('socket.io')(server);
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

let count = 0;

var hgetAllPromise = hash => {
  return new Promise((resolve, reject) => {
    client.hgetall(hash, (err, data) => resolve(data));
  });
};

var hmgetPromise = (hash, field) => {
  return new Promise((resolve, reject) => {
    client.hmget(hash, field, (err, data) => resolve(data));
  });
};

app.get('/', (req, res) => {
  let params = [];
  hgetAllPromise('messages')
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

let getMessageCounter = () => {
  return new Promise((resolve, reject) => {
    client.get('messageCounter', (err, data) => {
      if (err) {
        console.error(err);
      }
      return resolve(data);
    });
  });
};

let incrMessageCounter = () => {
  return new Promise((resolve, reject) => {
    client.incr('messageCounter', (err, data) => {
      if (err) {
        console.error(err);
      }
      return resolve(data);
    });
  });
};

let newMessagePromise = (counter, data) => {
  return new Promise((resolve, reject) => {
    client.hmset('messages', counter, data, (err, data) => {
      if (err) {
        console.error(err);
      }
      return resolve(data);
    });
  });
};

client.setnx('messageCounter', 0);

app.post('/', (req, res) => {
  let newMessage = req.body.newMessage;

  incrMessageCounter()
    .then(getMessageCounter)
    .then(counter => {
      let obj = { body: newMessage, postedBy: 'Anon', room: 'Cats' };
      obj = JSON.stringify(obj);
      return newMessagePromise(counter, obj);
    })
    .then(res.redirect('back'))
    .catch(console.error);
});

io.on('connection', client => {
  client.on('newMessage', message => {});
});

//Start server
server.listen(3000);
