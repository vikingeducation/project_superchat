const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');

const io = require('socket.io')(server);

const handlebars = require('express-handlebars');
const port = 3030;

const { 
  // makeUser,
  makePost,
  getAllPosts
} = require('./services/redis-store');

app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/update', (req, res) =>{
  let message = req.body.message;
  let p1 = makePost(message);
  let p2 = getAllPosts('main');

  Promise.all([p1, p2]).then(values => {
    let messages = values[1];
    io.sockets.emit('new message', messages);
    res.redirect('back');
  });
});

io.on('connection', client => {
  let p1 = getAllPosts('main');

  p1.then(messages => {
    client.emit('new message', messages);
  });

  client.on('send message', () =>{});
});

server.listen(port, () => {
    console.log(`Currently listening on Port ${ port }`)
});

// So now what we're going to do is the following:
// '/' will be a simple login page. 'if (req.cookies.username) redirect /chatroom/main/'
// 'else login here'
// every page will have if (!req.cookies.username) redirect '/'
// then you'll have
// /chatroom/:chatroom
// checks if chatroom exists in current redis structure
// req.params.chatroom is sent to getallposts/getAllPosts
// the tricky part will be handling all the socket io events for the different channels
// you also need /chatroom itself which will list all available chatrooms, stored in a separate redis structure
//