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
  /*
  client.getall((err, data) => {
    //data == 1
    let dataObj = hmget('messages', data);
    console.log("dataobj is " + dataObj);
    let jsonObj = JSON.parse(dataObj);
    //jsonObj = {body:,postedBy:}
    params.push(jsonObj);
  })

  */
});

app.post('/', (req, res) => {
  let newMessage = req.body.newMessage;

  /*
  client.hmget('messages', (err, data) => {
    console.log(err);
    console.log(data);
  })

  */
  let obj = { body: newMessage, postedBy: '', room: '' };
  obj = JSON.stringify(obj);
  client.hmset('messages', '1', obj);
  client.hmset('messages', '2', obj);
  console.log(newMessage);
  console.log(obj);
});

//Start server
server.listen(3000);
