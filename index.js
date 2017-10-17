const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const hbs = expressHandlebars.create({defaultLayout: 'main'});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send("Let's Chat!");
});

app.get('/chat', function(req, res) {
  res.render('index', {title: "Let's Begin!"});
});

server.listen(4700, () => {
  console.log("Check out localhost:4700 for my awesome Super Chat app!");
});
