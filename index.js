const http = require("http");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const redisClient = require("redis");

const server = http.createServer(app);
const io = require("socket.io")(server);