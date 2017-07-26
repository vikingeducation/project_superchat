const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const port = 4000;
const redisTools = require("./lib/redis_tools");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var myUserName = "Word Eater was Here";

app.get("/", (req, res) => {
  if (req.cookies.username) {
    console.log(`username: ${req.cookies["username"]}`);
    //go to chat
    myUserName = req.cookies.username;
    console.log("Cookie was stored");
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
  if(!checkUserNameExist(req.body.name)) {
    res.cookie("username", req.body.name);

    res.redirect('/');
  } else {
    window.alert("Your username exists");
    res.end();
  }


  console.log(res.cookie["username"]);

});

const checkUsernameExist = ( name ) => {
  return redisTools.getUsernames().includes(name);
}




app.listen(port, () => {
  console.log("Serving!");
});
