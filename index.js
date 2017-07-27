const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const redisTools = require("./lib/redis_tools");

// const { getUserIds, getUsername } = require("./lib/get_user_info");
const { getUsernames } = require("./lib/get_user_info");
const { getRoomNames } = require("./lib/room_info");
const { generateUserInfo, generateRoomInfo } = require("./lib/redis_tools");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));

app.use(
  "/socket.io",
  express.static(`${__dirname}/node_modules/socket.io-client/dist/`)
);
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", client => {
<<<<<<< HEAD
  // send all current chats to rooms
  getRoomNames().then(roomNames => {
    client.emit("updateRooms", roomNames);
  });
=======
  
  // send all current chats to rooms
  getRoomNames()
  .then((roomNames) => {
    client.emit("updateRooms", roomNames);
  })

>>>>>>> d74df601d750fa61d1ab68d0449efa4bef4c0184

  client.on("newChatRoom", newChatRoom => {
    io.emit("newChatRoomFromServer", newChatRoom);
    console.log(`newchatRoom: ${newChatRoom}`);
<<<<<<< HEAD
    generateRoomInfo(newChatRoom).then(() => {
      console.log("worked");
    });
=======
    generateRoomInfo(newChatRoom)
    .then(() => {
        console.log("worked");
      })
>>>>>>> d74df601d750fa61d1ab68d0449efa4bef4c0184
  });
});

app.get("/", (req, res) => {
  console.log(req.cookies);
  if (req.cookies.username) {
    res.redirect("/chatrooms");
  } else {
    res.render("loginScreen");
  }
});

app.post("/", (req, res) => {
  console.log(req.body.name);
  res.cookie("username", req.body.name);
  //res.cookie("username", req.body.name);

  // Safety make sure we don't make 2 USER_IDS
  getUsernames().then(usernames => {
    console.log(usernames);
    if (usernames.includes(req.body.name)) {
      res.redirect("/");
    } else {
<<<<<<< HEAD
=======

>>>>>>> d74df601d750fa61d1ab68d0449efa4bef4c0184
      generateUserInfo(req.body.name).then(() => {
        res.redirect("/");
      });
    }
  });
});

app.get("/chatrooms", (req, res) => {
  res.render("chatLobby", { username: req.cookies.username });
});

<<<<<<< HEAD
=======

>>>>>>> d74df601d750fa61d1ab68d0449efa4bef4c0184
server.listen(3000, () => {
  console.log("Serving gormet lobster!");
});
