const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let cookieArray = [];

app.get('/', (req, res) => {

  let usernameExist = cookieArray.reduce((exist, cookie) => {
    return exist || (cookie.username === req.body.username);
  }, false);



  let cookieObj = req.cookies.cookieObj || {};

  cookieObj.username = req.body.username;
})
