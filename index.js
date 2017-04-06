const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const ra = require("./lib/ra");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

const hbs = expressHandlebars.create({
  defaultLayout: "main"
});

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

io.on("connection", client => {
  client.on("createNewRoom", newRoomName => {
    //let user = client.username;
    ra.addRoom(newRoomName);

    io.emit("createdNewRoom", newRoomName);
  });

  client.on("postMessage", (newMessage, room) => {
    let user = client.username;
    ra.postMessage(client, newMessage, room);

    io.emit("newMessage", newMessage, user, room);
  });

  client.on("signUp", newUser => {
    ra.getUserList(client, newUser);
  });

  client.on("userLoggedOut", currentUser => {
    currentUser = "user_" + currentUser;
    ra.destroyUser(currentUser);
  });

  client.on("launchChatRoom", nameOfRoom => {
    currentRoom = nameOfRoom;
    var allMessages = ra.getAllMessages(nameOfRoom);

    // messageID,
    // 'messageBody',
    // newMessage,
    // 'username',
    // user,
    // 'roomName',
    // room
  });
}); // end of io-on method

app.get("/", (req, res) => {
  ra.getAllRoomNames().then(roomNames => {
    res.render("index", { roomNames });
  });

  // ra.getAllMessages().then(messageList => {
  //   res.render("index", { messageList });
  // });
});

server.listen(3000);

module.exports = {
  //renderHomePage
};
