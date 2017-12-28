const express = require('express');
const app = express();

// REDIS
const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})

// BODY PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true}) );

//SOCKET.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

//HANDLEBARS
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs( { defaultLayout: 'main' } ));
app.set('view engine', 'handlebars');

//ASSETS
app.use(express.static(`${__dirname}/public`));


app.get('/', (req, res)=> {
  res.render('chat')
})


app.listen(3000);
