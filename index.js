const http = require("http");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redisWrapper.js");

const server = http.createServer(app);
const io = require("socket.io")(server);

let messageIDs = [1, 2];

redis.loadMessages(messageIDs);
