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
  createRoom
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
  getAllData().then(data => {
    res.render("index.handlebars", {
      data,
      name: req.cookies.user || "Anonymous"
    });
  });
});

app.post("/name", (req, res) => {
  let userName = req.body.name;
  res.cookie("user", userName);
  res.redirect("/");
});

app.post("/clear", (req, res) => {
  res.cookie("user", "Anonymous");
  res.redirect("/");
});

io.on("connection", client => {
  client.on("created room", room => {
    createRoom(room).then(() => {
      io.emit("room created");
    });
  });

  client.on("newMessage", data => {
    let returnData = data;
    let room = data[2];
    let user = data[0];
    let message = data[1];
    newMessage(room, user, message).then(() => {
      io.emit("message saved", returnData);
    });
  });
});

server.listen(3000, () => {
  console.log(`Listening on localhost:3000`);
});
