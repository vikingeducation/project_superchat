<<<<<<< HEAD
const redisClient = require("redis").createClient();
//redisClient.usernames = redisClient.usernames || [];

const storeUsername = function(username) {
  return new Promise((resolve, reject) => {
    redisClient.lpush("usernames", username, (err, reply) => {
      if (err) reject(err);
      // User data storage worked correctly
      // redisClient.end() => do this if not working correctly

      resolve();
    });
=======
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
    redisTools.storeMessage(newMessage)
    .then(() => {
      redisTools.getMessages()
    })
    .then((data) => {
      console.log(`data: ${data}`);
    }, (err) => {
      console.error(err);
    })

    io.emit("newChatMessageFromServer", newMessage);
>>>>>>> f7498f77cca9b3041af3d75fb3fa8251388f8651
  });
};

const storeMessage = function(messageObj) {
  return new Promise((resolve, reject) => {
    // console.log(messageObj);
    // console.log(Object.keys(messageObj));

    // redisClient.lpush("messages", {
    //   username: messageObj.username,
    //   message: messageObj.message
    // });
    redisClient.lpush("messages", messageObj.message);
    if (err) reject(err);
    console.log(redisClient.messages);
    resolve();
  });
};

<<<<<<< HEAD
const getMessages = function() {};
=======
app.post("/", (req, res) => {
  //check username that is entered
  //TODO: confirm req.body.name as syntax
  redisTools.getUsernames()
  .then((usernames) => {
    console.log(usernames);
    if(!usernames.includes(req.body.name)) {
      res.cookie("username", req.body.name);
      redisTools.storeUsername(req.body.name);
      res.redirect("/");
    } else {
      res.end();
    }
  })
});
>>>>>>> f7498f77cca9b3041af3d75fb3fa8251388f8651

var getUsernames = () => {
  return redisClient.usernames;
};
storeUsername.usernames = redisClient.usernames;

module.exports = {
  storeUsername,
  getUsernames,
  storeMessage
};
