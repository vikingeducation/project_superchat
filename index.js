const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redisClient = require("redis").createClient();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

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

express.static(__dirname + )

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
		"room",
		"Cats"
    (error, result) => {
      if (error) res.send("Error: " + error);
      redisClient.hgetall("message", function(err, object) {
        messageArr.push(object);
        console.log(object);
        res.render("index", {
          userMessages: messageArr
        });
      });
    }
  );
});

server.listen(3000);
