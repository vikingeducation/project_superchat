const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redisClient = require("redis").createClient();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");

const hbs = expressHandlebars.create({ defaultLayout: "main" });
let chatRooms = ["Cats", "Dogs", "Programmers"];
let newUsername = "";

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.get("/", (req, res) => {
  if (req.cookies.nameInput) {
    res.render("index", { chatRooms: chatRooms });
  } else {
    newUsername = req.cookies.nameInput;
    console.log(req.cookies.nameInput);
    res.render("newUser");
  }
});

app.get("/:room", (req, res) => {
  res.render("chatroom", {
    chatRooms: chatRooms,
    currentRoom: req.params.room
  });
});

app.post("/", (req, res) => {
  res.cookie("nameInput", req.params.nameInput);
  console.log(req.cookies.nameInput);
  res.redirect("/");
});

io.on("connection", client => {
  client.on("submit", data => {
    let setCommentPromise = data => {
      return new Promise((resolve, reject) => {
        redisClient.hmset(
          "message",
          "user",
          newUsername,
          "userMessage",
          data,
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });
    };

    setCommentPromise(data)
      .then(result => {
        return new Promise((resolve, reject) => {
          redisClient.hgetall(
            "message",
            (err, object) => (err ? reject(err) : resolve(object))
          );
        });
      })
      .then(result => {
        io.emit("messages", result);
      })
      .catch(err => io.emit("error", err));
  });
});

server.listen(3000);
