const express = require('express');
const path = require('path');
const logger = require('morgan');
const morganToolkit = require('morgan-toolkit')(logger);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const exphbs = require('express-handlebars');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const index = require('./routes/index');

const app = express();

// view engine setup
const hbs = exphbs.create({
  helpers: helpers,
  partialsDir: 'views/partials/',
  defaultLayout: 'main.hbs',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('Handlebars', hbs);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket.io',express.static(path.join(__dirname, 'node_modules/socket.io-client/dist/')));
app.use(logger('short'));
app.use(morganToolkit());

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = require('http').createServer(app);


const io = require('socket.io')(server);

module.exports = { app, io };

const socket = require('./lib/socket_service');
socket.setup(io);

server.listen(process.env.PORT || '3000');

