const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.end("hi!");
});

server.listen(3000, () => {
  console.log(`Listening on localhost:3000`);
});
