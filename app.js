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
} = require('./services/redis_handler')

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.end("hi!");
});

io.on('connection', client => { 
  let data = redisClient.getAllData();
  res.render(index.handlebars)
}

io.on('joined room', (room)=> {
  joinRoom(room).then( () => {
    client.emit('room joined')
  });
} )

io.on('exited room', (room)=>{
  exitRoom(room).then( () => {
    client.emit('room exited')
  });
} )


io.on('created room', (room) => {
  createRoom(room).then( (room) => {
    io.emit('room created', room)
  });
} )

io.on('newMessage', (data) => {
  let room = data[0]
  let user = 
  newMessage(room, user, message).then( () => {
    io.emit('newMessage', data)
  });
} )


server.listen(3000, () => {
  console.log(`Listening on localhost:3000`);
});
