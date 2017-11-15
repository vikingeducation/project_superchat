"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redis-lib");
const expressSession = require("express-session");

const PORT = process.env.PORT || 3000;

//setup handlebars
app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
// this code may not be useful
// see here for app.use() usage: https://expressjs.com/en/api.html#path-examples
app.use(
	"/socket.io",
	express.static(__dirname + "node_modules/socket.io-client/dist/")
);
//nice to have / do later: store session in redis, not memory
//attach to req.session
//to destroy session: req.session = null
app.use(
	expressSession({
		name: "dcsession",
		secret: "secret sauce",
		saveUninitialized: true,
		resave: true,
		cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
	})
);

//register routes
app.get("/", (req, res) => {
	console.log("In route........................");
	// if (req.session) {
	// 	console.log("SESSION");
	// 	console.log(req.session);
	// 	console.log("SESSION ID");
	// 	console.log(req.sessionID);
	// 	console.log("COOKIE");
	// 	console.log(req.session.cookie);
	// } else {
	// 	console.log("NO SESSION");
	// }
	res.render("results", {});
});

io.on("connection", socket => {
	console.log("In connection ........................");
	// if (req.session) {
	console.log("CONNECTION: socket.username = " + socket.username);
	let whoseOnline = [];
	let onlineCount = 0;
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("DISCONNECTION: socket.username = " + socket.username);
		// if (!socket.username) {
		// return;
		// }
		redis
			.removeSortedItem("whoseOnline", socket.username)
			.then(data => {
				console.log("in promise removeSortedItem, num removed = " + data);
				console.log(
					"in promise removeSortedItem, socket.username = " + socket.username
				);
				console.log("in promise removeSortedItem, whoseOnline= " + whoseOnline);
				return redis.getCount("whoseOnline");
			})
			.then(data => {
				let count = data;
				io.emit("get count", count);
				return redis.getSortedItems("whoseOnline");
			})
			.then(data => {
				let whoseOnline = data;
				io.emit("get logins", whoseOnline);
			})
			.catch(err => {
				console.log(err);
			});

		//take username out of redis
		//update usernames
		//ie, io.sockets.emit('get users', usernames);
		console.log("--> user disconnected");
	});

	socket.on("new login", (data, callback) => {
		callback(true);
		socket.username = data;

		console.log("NEW LOGIN: socket.username = " + socket.username);
		redis
			.addSortedItem("whoseOnline", socket.username)
			.then(data => {
				return redis.getCount("whoseOnline");
			})
			.then(data => {
				onlineCount = data;
				return redis.getSortedItems("whoseOnline");
			})
			.then(data => {
				whoseOnline = data;
				console.log("whoseOnline[] = ", whoseOnline);
				io.emit("new login", socket.username);
				io.emit("get logins", whoseOnline);
				io.emit("get count", onlineCount);
			})
			.catch(err => {
				console.log(err);
			});
	});

	socket.on("new message", data => {
		let msg = data;
		let username = socket.username;
		console.log("NEW MESSAGE: socket.username = " + socket.username);
		// let username = "anon";
		io.emit("new message", msg, username);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on localhost:${PORT}`);
});
