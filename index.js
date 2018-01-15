const express = require('express');
const app = require('express')();
const path = require('path');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// functions
const { getAllUsernames } = require('./lib/users');
const { generateUserInfo } = require('./lib/generate');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

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
   let view;
   if(req.cookies.username) {
      view = 'home';
   } else {
      view = 'login';
   }

   let room = {
      name: 'roomName',
      messages: ['hello', 'hey there', 'testing'],
      authors: ['catperson', 'dogperson', 'robot']
   };
   res.render(view, { room: room });
});



// need to fix username exists/view issue
app.post('/login', urlencodedParser, (req, res) => {
   let view;
   // if user entered a valid username
   if(req.body.username) {
      res.cookie('username', req.body.username);
      getAllUsernames().then((usernames) => {
         // make sure username doesn't already exist
         if(usernames.includes(req.body.username)) {
            // error that username exists
            res.render('login');
         } else {
            generateUserInfo(req.body.username);
            res.redirect('/');
         } 
      });
   } 

});

app.post('/new', (req, res) => {
   // submit data 
   res.redirect('back');
});

// Listen
server.listen(3000);