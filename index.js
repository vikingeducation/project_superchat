const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redisClient = require("redis").createClient();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

let chatRooms = ["Cats", "Dogs", "Programmers"];
let messageArr = [];

app.get("/", (req, res) => {
  res.render("index", { chatRooms: chatRooms });
});

app.get("/:room", (req, res) => {
  res.render("chatroom", {
    chatRooms: chatRooms,
    currentRoom: req.params.room
  });
});

app.post("/:room", (req, res) => {
  redisClient.hmset(
    "message",
    "user",
    "Anon",
    "userMessage",
    req.body.userMessage,
    "room",
    req.params.room,
    (error, result) => {
      if (error) res.send("Error: " + error);
      redisClient.hgetall("message", function(err, object) {
        messageArr.push(object);
        res.render("chatroom", {
          userMessages: messageArr,
          chatRooms: chatRooms,
          currentRoom: req.params.room
        });
      });
    }
  );
});

server.listen(3000);
