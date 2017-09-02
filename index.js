const express = require('express');
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const redis = require('redis');
const http = require('http');
const cookieParser = require("cookie-parser");
var cookieSession = require('cookie-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chatRooms = require("./modules/chatRooms");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);
//Set Directory for public folder
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

// Set up cookies

app.use(cookieParser());
// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------

app.use(cookieSession({
  name: 'session',
  keys: ['asdf1234567890qwer']
}));

// Set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: 'views/'
}));
app.set("view engine", "handlebars");

app.get("/", (req,res) => {
  const userCook = req.cookies['userName'];
  if (userCook === '' || userCook === undefined) {
    res.render("login");
  }
  else {
    res.redirect(`/${userCook}/rooms`)
  }
})

app.get("/logout", (req,res) => {
  res.cookie('userName', "");
  res.redirect("/");
})

app.get("/:user/rooms", (req, res) => {
  const user = req.params.user;
  res.cookie('userName', user);
  Promise.resolve(
    chatRooms.getRooms()
  ).then ( (values)=> {
    let roomNames = values
    res.render("rooms", {roomNames, user});
  })

});

app.get("/:user/rooms/:roomName", (req, res) => {
  const user = req.params.user;
  const roomName = req.params.roomName
  Promise.all([
    chatRooms.getRoomMessages(roomName),
    chatRooms.getRoomAuthors(roomName)
  ]).then ( (values)=> {
    let roomMessages = values[0]
    let roomAuthors = values[1]
    res.render("chatRoom", {roomMessages, roomAuthors, roomName, user});
  })

});



app.post("/newUser", (req,res)=>{
  const user = req.body.UserName;
  if (user === "") {
    res.redirect('back');
  }
  else {
    chatRooms.setUser(user);
    res.redirect(`/${user}/rooms`);
  }
})

app.post("/:user/rooms/newRoom", (req,res) => {
  // const user = req.params.user;
  // const newRoom = req.body.textNewRoom;
  // Promise.resolve(
  //   chatRooms.setRoom(newRoom)
  // ).then( ()=> {
  //   res.redirect("back");
  // })
  res.redirect("back");
});

app.post("/:user/rooms/:roomName/newMessage", (req,res) => {
  // const roomName = req.params.roomName;
  // const user = req.params.user;
  // const message = req.body.textNewMessage;
  // chatRooms.setRoomMessage(message, roomName);
  // chatRooms.setRoomAuthor(user, roomName);
  res.redirect("back");
})



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('newMessageSubmit', function(data) {
      chatRooms.setRoomMessage(data.newEnteredMessage, "Cats");
      chatRooms.setRoomAuthor(data.newEnteredUser, "Cats");
      io.emit('newMessage', {data})
    })
    socket.on('newRoomSubmit', function(data) {
      chatRooms.setRoom(data.newEnteredRoom);
      io.emit('newRoom', {data})
    })
  })

server.listen(process.env.PORT || 3000);
