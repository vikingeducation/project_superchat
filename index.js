const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const port = 4000;
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let cookieArray = [];
var myUserName = "Word Eater was Here";
app.get("/", (req, res) => {
  console.log(req.cookie);
  if (req.cookie !== undefined) {
    //go to chat
    myUserName = req.cookie.username;
    res.render("chatScreen");
  } else {
    //cont go to chat //login?
    //post data//then check the name they enter against names saved
    res.render("loginScreen");
  }
});
app.post("/", (req, res) => {
  //check username that is entered
  //TODO: confirm req.body.name as syntax
  console.log(req.body.name);
  res.cookie["username"] = req.body.name;
  console.log(res.cookie["username"]);
});
app.listen(port, () => {
  console.log("Serving!");
});
