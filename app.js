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

app.get("/", (req, res) => {
  redisClient.KEYS("*", (err, keys) => {
    console.log(keys);
  });

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

var newpost = () => {
  return new Promise((resolve, reject) => {
    resolve(io.emit("update", "data"));
    // io.emit("update", "data", (error, message) => {
    //   if (error) {
    //     return reject(error);
    //   }
    //   return resolve(message);
    // });
  });
};

let messageArr = [];

app.post("/chatroom/newpost", (req, res) => {
  console.log(req.body.newpost);

  let username = req.cookies.username;
  let content = req.body.newpost;
  let chatroom = req.body.chatroomId.toString().toLowerCase();
  let randomNum = Math.random();
  let messageId = chatroom + String(randomNum);

  let existingId = redisClient.KEYS(messageId, (err, key) => {
    if (err) return false;
    if (key) return true;
  });

  while (!existingId) {
    messageId += String(randomNum);
  }

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
        res.render("index", {
          messages: messageArr,
          username: req.cookies.username
        });
      });
    }
  );
});
// newpost()
//   .then(message => {
//     console.log("this is the io.emit message: " + message);
//     io.emit("update", "data");
//   })
//   .then(data => res.redirect("/"))
//   .catch(error => {
//     console.log(error);
//   });

server.listen(3000);
