// Express
const express = require('express');
const app = express();

// Socket.io
const server = require('http').createServer(app);
require('./lib/controllers/sockets')(server);
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

// Session
const session = require('express-session');
app.use(
  session({
    secret: 'DzibDjZGbwDzibDjZGbw',
    resave: false,
    saveUninitialized: true
  })
);

// Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Static files
app.use('/public', express.static(`${__dirname}/public`));

// Router
const router = require('./lib/controllers/routes');
app.get('/', router);

// Start server!
const env = require('./env');
server.listen(env.port, env.hostname, () => {
  console.log('Cooking with gas!');
});
