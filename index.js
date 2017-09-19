const http = require("http");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redisWrapper.js");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cookie = require("cookie");
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist/")
);

app.use("/", express.static(__dirname + "/public"));
app.use(
  "/handlebars",
  express.static(__dirname + "/node_modules/handlebars/dist/")
);

app.get("/", (req, res) => {
  if (!req.cookies.user) {
    res.render("login");
  } else {
  	console.log(req.cookies.user);
    redis.getRooms(req.cookies.user).then(rooms => {
    	console.log(rooms);
      res.render("index", {
        rooms: rooms,
        user: req.cookies.user
      });
    });
  }
});

app.post("/", (req, res) => {
  let user = req.body.user;
  redis.saveUser(user);
  res.cookie("user", user, { httpOnly: false });

  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

io.on("connection", client => {
  let cookies = client.handshake.headers.cookie;
  let user = cookie.parse(cookies).user;
  console.log("New connection");

  client.on("newMessage", data => {
    redis.saveMessage(data.body, data.author, data.room).then(() => {
      io.emit("updateMessages", data);
    });
  });

  client.on("newRoom", data => {
    redis.saveRoom(user, data).then(() => {
      client.emit("updateRooms", data);
    });
  });

  client.on("showRoom", data => {
    redis.loadRoomMessages(data, messages => {
      let output = {
        messages: messages,
        room: data
      };
      client.emit("roomLoaded", output);
    });
  });

  client.on("leaveRoom", room => {
    redis.leaveRoom(user, room).then(() => {
      client.emit("leftRoom", room);
    });
  });
});

server.listen(3000);
