const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const redisTools = require("./lib/redis_tools");
const port = 4000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));

let pathname = `${__dirname}/node_modules/socket.io-client/dist/`;
console.log(pathname);
app.use("/socket.io", express.static(pathname));
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", client => {
  client.on("newChatMessage", newMessage => {
    console.log(newMessage);

    io.emit("newChatMessageFromServer", newMessage);
  });
});

app.get("/", (req, res) => {
  if (req.cookies.username) {
    console.log(`username: ${req.cookies["username"]}`);
    //go to chat
    myUserName = req.cookies.username;
    console.log("Cookie was stored");
    res.render("chatScreen", { username: myUserName });
  } else {
    //cont go to chat //login?
    //post data//then check the name they enter against names saved
    res.render("loginScreen");
  }
});

app.post("/", (req, res) => {
  //check username that is entered
  //TODO: confirm req.body.name as syntax
  if (!checkUsernameExist(req.body.name)) {
    res.cookie("username", req.body.name);
    redisTools.storeUsername(req.body.name);
    res.redirect("/");
  } else {
    console.log("exists");
  }
});

var checkUsernameExist = function(name) {
  return redisTools.getUsernames().includes(name);
};

server.listen(4000, () => {
  console.log("Serving!");
});
