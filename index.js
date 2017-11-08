"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
// const redis = require("./lib/redis-lib");

const PORT = 3000;

app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

//register routes
app.get("/", (req, res) => {
	res.render("results", { test: "test content" });
});

io.on("connection", socket => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(PORT, () => {
	console.log(`Listening on localhost:${PORT}`);
});
