const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redisClient = require("redis").createClient();
const io = require("socket.io")(server);
const app = express();
const server = require("http").createServer(app);

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.use(bodyParser.urlencoded({ extended: false }));

let messageArr = [];

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  redisClient.hmset(
    "message",
    "user",
    "Anon",
    "userMessage",
    req.body.userMessage,
    (error, result) => {
      if (error) res.send("Error: " + error);
      redisClient.hgetall("message", function(err, object) {
        messageArr.push(object);
        res.render("index", {
          userMessage: messageArr
        });
      });
    }
  );
});

server.listen(3000);
