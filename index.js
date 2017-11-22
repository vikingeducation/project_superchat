const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const redisClient = require('redis').createClient();
const io = require('socket.io')(server);
const app = express();
const server = require('http').createServer(app);

const hbs = expressHandlebars.create({
partialsDir: "views/"
defaultLayout: "main"});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use('/socket.io', express.static(__dirname + "node_modules/socket.io-client/dist/"));

app.get('/', (req, res) => {
	res.render('index')
})

