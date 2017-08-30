const express = require('express');
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const redis = require('redis');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
app.use(express.static(__dirname + "/public"));

// Set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: 'views/'
}));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
})

server.listen(3000);
