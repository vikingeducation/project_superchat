var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const dataMgr = require('./bin/dataMgr');
// dispatcher for IO requests from client_sockets
io.on('connection', client => {
  console.log("New connection!")

  client.on('addRoom', (roomName) => {
    dataMgr.addRoom(roomName).then(function(){
      io.emit('newRoom', roomName);
    });
  });

  client.on('getMessages', (roomName) => {
    dataMgr.getMessages(roomName).then(function(data){
      client.emit('messageList', data);
    })
  });

  client.on('sendMessage', (message) => {
    dataMgr.sendMessage(message.room, message.user, message.text).then(function(data){
      io.emit('newMessage', {room: message.room, user: message.user, text: message.text});
    })
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  req.io = io;
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
