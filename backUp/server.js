const cp = require('child_process');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redisClient = require('redis').createClient();

app.get("/", (req, res) => {
  res.render()
})




