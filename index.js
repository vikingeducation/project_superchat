const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { getMessages, setMessage } = require('./helpers/redis-store.js');


app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'))
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.io = io;
  next();
});


io.on('connection', client => {
  console.log('New connection');
});



app.get('/', (req, res) => {
  getMessages().then(allMessages => {
    res.render('index', {allMessages});
  });
});

app.post('/posts/new', (req, res) => {
  let io = req.io;
  let newMessage = req.body.message;

  setMessage(newMessage).then((data) => {
    io.emit('new message', data);
    res.redirect('back');
  });
});




server.listen(3000, () => {
  console.log('Listening to port 3000');
});
