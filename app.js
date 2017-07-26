const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const redisClient = redis.createClient();
const {
  getAllData,
  newMessage,
  createRoom,
  exitRoom,
  joinRoom
} = require("./services/redis_handler");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));

app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client-dist/")
);

app.get("/", (req, res) => {
  let data = getAllData();
  data.userName = req.cookies.userName;
  res.render("index.handlebars", { data });
});

io.on("connection", client => {
  io.on("joined room", room => {
    joinRoom(room).then(() => {
      client.emit("room joined");
    });
  });

  io.on("exited room", room => {
    exitRoom(room).then(() => {
      client.emit("room exited");
    });
  });

  io.on("created room", room => {
    createRoom(room).then(room => {
      io.emit("room created", room);
    });
  });

  io.on("newMessage", data => {
    let room = data[2];
    let user = data[0].split(":")[1];
    let message = data[1];
    newMessage(room, user, message).then(() => {
      io.emit("message saved", data);
    });
  });

  io.on("login", name => {
    res.cookie("user", userName);
  });
});

server.listen(3000, () => {
  console.log(`Listening on localhost:3000`);
});
