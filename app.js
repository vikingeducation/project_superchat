const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const redisClient = redis.createClient();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.end("hi!");
});

//io.connection =>

//listen for page load

//read redis data / store in object =>
//render HBS with data

//io.on (joined room)
//joinRoom() =>
//.then(room) emit "joined [room]"

//io.on (exit room)

//exitRoom() =>
//.then(room) emit "exited [room]"

//io.on (createRoom)
//createRoom() =>
//.then emit "created [room]"

//io.on (newMessage)
//newMessage(room, user, message) =>
//.then emit "message added"

server.listen(3000, () => {
  console.log(`Listening on localhost:3000`);
});
