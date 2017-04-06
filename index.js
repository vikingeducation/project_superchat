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
  client.on("postMessage", newMessage => {
    let user = client.username;
    ra.postMessage(client, newMessage);

    io.emit("newMessage", newMessage, user);
  });

  client.on("signUp", newUser => {
    ra.getUserList(client, newUser);
  });

  client.on("userLoggedOut", currentUser => {
    currentUser = "user_" + currentUser;
    ra.destroyUser(currentUser);
  });
});

app.get("/", (req, res) => {
  ra.getAllMessages().then(messageList => {
    res.render("index", { messageList });
  });
});

server.listen(3000);

module.exports = {
  //renderHomePage
};
