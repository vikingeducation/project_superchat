const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const redisClient = require("async-redis").createClient();
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

redisClient.on("error", function(err) {
  console.log("Error " + err);
});

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

let firstmessageArr = []; // this is the message array for ./
app.get("/", (req, res) => {
  redisClient.KEYS("*", (err, keys) => {
    keys.forEach(key => {
      redisClient.hgetall(key, (err, obj) => {
        firstmessageArr.push(obj);
      });
    });
  });

  if (req.cookies.username) {
    res.render("index", {
      username: req.cookies.username,
      messages: firstmessageArr
    });
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

let messageArr = []; // this is the message array for ./chatroom/newpost
app.post("/chatroom/newpost", (req, res) => {
  console.log(req.body.newpost);

  let username = req.cookies.username;
  let content = req.body.newpost;
  let chatroom = req.body.chatroomId.toString().toLowerCase();
  let randomNum = Math.random();
  let messageId = chatroom + String(randomNum);

  //checks to make sure messageiD is unique and if it is set it with hmset
  redisClient.KEYS(messageId, (err, key) => {
    if (err) {
      redisClient.hmset(
        messageId,
        {
          username,
          content,
          chatroom
        },
        (error, result) => {
          if (error) res.send("Error: " + error);
          redisClient.hgetall(messageId, (err, obj) => {
            messageArr.push(obj);
            io.emit("update", "data");
            res.render("index", {
              messages: messageArr,
              username: req.cookies.username
            });
          });
        }
      );
    } else {
      messageId = chatroom + String(Math.random());
      redisClient.hmset(
        messageId,
        {
          username,
          content,
          chatroom
        },
        (error, result) => {
          if (error) res.send("Error: " + error);

          redisClient.hgetall(messageId, (err, obj) => {
            messageArr.push(obj);
            io.emit("update", "data");
            res.render("index", {
              messages: messageArr,
              username: req.cookies.username
            });
          });
        }
      );
    }
  });
});

server.listen(3000);
