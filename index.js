const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const expressHandlebars = require("express-handlebars");
const cp = require('cookie-parser');
redisClient = require("redis").createClient();

app.use(bodyParser.urlencoded({ extended: true }));

const hbs = expressHandlebars.create({
  defaultLayout: "main",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.get('/', (req, res) => {
  res.render('index')
})


server.listen(8000)