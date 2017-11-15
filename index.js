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

app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
//setup middleware
//attach to req.session
//to destroy session: req.session = null

app.use(express.static(__dirname + "/public"));
// this code may not be useful
// see here for app.use() usage: https://expressjs.com/en/api.html#path-examples
app.use(
	"/socket.io",
	express.static(__dirname + "node_modules/socket.io-client/dist/")
);
//nice to have / do later: store session in redis, not memory
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
	console.log("$$$$$ IN route!!");
	//get allChatroomNames into array
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

	// let whoseOnline = [];
	// let countOnline = 0;
	// redis
	// 	.getSortedItems("whoseOnline")
	// 	.then(data => {
	// 		whoseOnline = data;
	// 		console.log(whoseOnline);
	// 		return redis.getCount("whoseOnline");
	// 	})
	// 	.then(data => {
	// 		countOnline = data;
	// 		res.render("results", {
	// 			whoseOnline: whoseOnline,
	// 			countOnline: countOnline
	// 		});
	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 	});
	res.render("results", {});
});

io.on("connection", socket => {
	let whoseOnline = [];
	let onlineCount = 0;
	console.log("a user connected");
	socket.on("disconnect", () => {
		// if (!socket.username) {
		// return;
		// }
		redis
			.removeSortedItem("whoseOnline", socket.username)
			.then(data => {
				console.log(data);
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
		//create session here??
		socket.username = data;

		console.log("socket.username = " + socket.username);
		console.log("$$$$$ IN SOCKETS!!");
		redis
			.addSortedItem("whoseOnline", socket.username)
			.then(data => {
				console.log("after addSortedItem socket.username: " + data);
				return redis.getCount("whoseOnline");
			})
			.then(data => {
				onlineCount = data;
				return redis.getSortedItems("whoseOnline");
			})
			.then(data => {
				whoseOnline = data;
				console.log("!!!@@@@@@@ whoseOnline[] = ", whoseOnline);
				io.emit("new login", socket.username);
				io.emit("get logins", whoseOnline);
				io.emit("get count", onlineCount);
			})
			.catch(err => {
				console.log(err);
			});

		//ie, io.sockets.emit('get users', usernames);
	});

	socket.on("new message", data => {
		let msg = data;
		let username = socket.username;
		// let username = "anon";
		io.emit("new message", msg, username);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on localhost:${PORT}`);
});
