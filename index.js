const express = require('express');
const app = express();
const router = express.Router();
const server = require('http').createServer(app);
const exphbs = require('express-handlebars');
const redis = require('async-redis');
const client = redis.createClient();
const io = require('socket.io')(server);

app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

let count = 0;

app.get('/', (req, res) => {
  console.log('hit');
  client.set();
});

//Start server
server.listen(3000);
