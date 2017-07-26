const http = require("http");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redisWrapper.js");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const io = require("socket.io")(server);
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  if (!req.cookies.user) {
    res.render("login");
  } else {
    redis.loadMessages(messages => {
      res.render("index", {
        messages: messages,
        user: req.cookies.user
      });
    });
  }
});

app.post("/", (req, res) => {
  let user = req.body.user;
  redis.saveUser(user);
  res.cookie("user", user);

  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

io.on("connection", client => {
  console.log("New connection");

  client.on("newMessage", data => {
    var p = redis.saveMessage(data.body, data.author, data.room);

    p.then(() => {
      console.log("Promise found!");
      io.emit("updateMessages", data);
    });
  });
});

server.listen(3000);
