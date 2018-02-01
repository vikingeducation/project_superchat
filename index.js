const express = require('express');
const app = require('express')();
const path = require('path');

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// functions
const { getAllUsernames } = require('./lib/users');
const { generateUserInfo, generateMessageInfo } = require('./lib/generate');
const { getDisplayInfo, associateRoomsMessages, sortRooms } = require('./lib/data-display');
const { helper } = require('./lib/helpers');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Serve public middleware
app.use("/public", express.static(path.join(__dirname, "/public")));

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const redis = require('redis');
const redisClient = redis.createClient();

// Static middleware to serve the socket.io client library to front-end
app.use('/socket.io', express.static(__dirname + 'node_modules/socket.io-client/dist/'));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', () => {
   // emit when there's a new message
});

// Routes
app.get('/', (req, res) => {
   let view;
   let username = req.cookies.username;
   // can also do if(!username) {redirect}
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
      // console.dir(messages);
      let results = helper(rooms, messages);
      
      res.render(view, { results: results });
      

   });
});

app.get('/log-out', ((req, res) => {
   res.clearCookie('username');
   res.redirect('/');
}));


// need to fix username exists/view issue
app.post('/login', urlencodedParser, (req, res) => {
   let view;
   // if user entered a valid username
   if(req.body.username) {
      getAllUsernames().then((usernames) => {
         // make sure username doesn't already exist
         // could just ask redis - faster 
         if(usernames.includes(req.body.username)) {
            // error that username exists
            res.render('login', { error: 'This username has been taken, please try again.'});
         } else {
            res.cookie('username', req.body.username);
            generateUserInfo(req.body.username);
            res.redirect('/');
         } 
      });
   } 

});

app.post('/new/user',  urlencodedParser, (req, res) => {
   // submit data 
   let roomName = req.body.roomname[0];
   let message = req.body.roomname[1];
   generateMessageInfo(message, req.cookies.username, roomName);
   res.redirect('back');
});

// Listen
server.listen(3000);