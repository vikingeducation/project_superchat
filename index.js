const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const ra = require('./lib/ra');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

const hbs = expressHandlebars.create({
  defaultLayout: 'main'
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

io.on('connection', client => {
  client.on('createNewRoom', newRoomName => {
    //let user = client.username;
    ra.addRoom(newRoomName);

    io.emit('createdNewRoom', newRoomName);
  });

  client.on('postMessage', (newMessage, room) => {
    let user = client.username;
    ra.postMessage(client, newMessage, room);

    io.emit('newMessage', newMessage, user, room);
  });

  client.on('signUp', newUser => {
    ra.getUserList(client, newUser);
  });

  client.on('userLoggedOut', currentUser => {
    currentUser = 'user_' + currentUser;
    ra.destroyUser(currentUser);
  });

  client.on('launchChatRoom', nameOfRoom => {
    var currentRoomMessages = ra.getAllMessages(nameOfRoom);
  });
}); // end of io-on method

app.get('/', (req, res) => {
  let roomPromise = ra.getAllRoomNames(); // Promise whose resolve is an array of room names
  let messagePromise = ra.getAllMessages(); // Promise whose resolve is an object filled with message objects

  Promise.all([roomPromise, messagePromise])
    .then(values => {
      let roomList = values[0]; // The array of roomnames, the first value in the promise resolve;
      res.render('index', { roomList });
    })
    .catch(reason => {
      console.log(reason);
    });
});

server.listen(3000);

module.exports = {
  //renderHomePage
};
