const express = require('express');
const app = require('express')();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Serve public middleware
app.use('/public', express.static(path.join(__dirname, "/public")));

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const redis = require('redis');
const redisClient = redis.createClient();

// Static middleware to serve the socket.io client library to front-end
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

const server = require('http').createServer(app);
const io = require('socket.io')(server);


// Routes
app.get('/', (req, res) => {
   let room = {
      name: 'roomName',
      messages: ['hello', 'hey there', 'testing'],
      authors: ['catperson', 'dogperson', 'robot']
   };
   res.render('home', { room: room });
});

app.post('/new', (req, res) => {
   // submit data 
   res.redirect('back');
});

// Listen
server.listen(3000);