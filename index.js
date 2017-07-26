var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
