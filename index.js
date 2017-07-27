const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
// const {
//   setShortenedLink,
//   getURL,
//   getAllURLs,
//   getAllCounts,
//   incrementCount
// } = require('./link-shortener');

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io-client/dist/')
);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  res.redirect('back');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
