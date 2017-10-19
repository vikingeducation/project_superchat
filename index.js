const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { newPost, getAllPosts } = require('./redisDataStore');

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use("/socket.io", express.static(__dirname + "node_modules/socket.io-client/dist/"));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/update', (req, res) =>{
  let message = req.body.newPost;
  let p1 = newPost(message);
  let p2 = getAllPosts('Main');

  Promise.all([p1, p2]).then(values => {
    let messages = values[1];
    io.sockets.emit('new message', messages);
    //res.redirect('back');
    res.end();
  });
});

io.on('connection', client => {
  let p1 = getAllPosts('Main');

  p1.then(messages => {
    client.emit('new message', messages);
  });
});

server.listen(4700, () => {
  console.log("Check out my awesome Super Chat app  at localhost:4700 !!");
});
