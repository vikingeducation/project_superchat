const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.use(express.static(__dirname + "/public"));

redisClient.setnx("count", 0);

app.get("/", (req, res) => {
  if (req.cookies.username) {
    res.render("index", { username: req.cookies.username });
  } else {
    res.render("login", {});
  }
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/");
});

app.post("/chatroom/signout", (req, res) => {
  res.render("login", {});
});

app.post("/chatroom/newpost", (req, res) => {});

server.listen(3000);
