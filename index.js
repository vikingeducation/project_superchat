const express = require('express');
const app = require('express')();
const path = require('path');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// functions
const { getAllUsernames } = require('./lib/users');
const { generateUserInfo } = require('./lib/generate');
const { getDisplayInfo, associateRoomsMessages, sortRooms } = require('./lib/data-display');
const { helper } = require('./lib/helpers');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Serve public middleware
app.use('/public', express.static(path.join(__dirname, "/public")));

const exphbs = require('express-handlebars');
const handlebars = exphbs.create({
   helpers: {
      helper: helper
   }
});

app.engine('handlebars', handlebars.engine);
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
   let username = req.cookies.username;
   if(username) {
      view = 'home';
   } else {
      view = 'login';
   }
   getDisplayInfo(username, (err, data) => {
      if(err) {
         console.error(err);
      }
      // array of message objects
      let messages = data.messages;
      
      // array of room names
      let roomNames = data.rooms;
      
      let rooms = sortRooms(messages);
      
      res.render(view, { rooms: rooms,
                         messages: messages });
      

   });
   // console.dir(displayData);
   // let room = {
   //    name: 'roomName',
   //    messages: ['hello', 'hey there', 'testing'],
   //    authors: ['catperson', 'dogperson', 'robot']
   // };
   // res.render(view, { room: room, 
   //                    parameter: 'parameter'});
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