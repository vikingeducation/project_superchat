"use strict";

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redis-lib");
const cookieSession = require("cookie-session");

const PORT = process.env.PORT || 3000;

app.set("views", __dirname + "/views");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup middleware
//attach to req.session
//to destroy session: req.session = null
app.use(
	cookieSession({
		name: "chatSession",
		keys: ["TYUHJert#$%xc$%^&567"],
		// Cookie Options
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	})
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
// this code may not be useful
// see here for app.use() usage: https://expressjs.com/en/api.html#path-examples
app.use(
	"/socket.io",
	express.static(__dirname + "node_modules/socket.io-client/dist/")
);

//register routes
app.get("/", (req, res) => {
	//get allChatroomNames into array
	let chatRooms,
		memberCounts = [];
	redis
		.getSortedItems("zchatrooms")
		.then(data => {
			chatRooms = data;
			console.log(chatRooms);
			return redis.getMessage("chatroomMemberCounter");
		})
		.then(data => {
			memberCounts = data;
			console.log(memberCounts);
			res.render("results", {
				chatRooms: chatRooms,
				memberCounts: memberCounts
			});
		})
		.catch(err => {
			console.log(err);
		});
});

io.on("connection", socket => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("--> user disconnected");
	});

	socket.on("new login", (data, callback) => {
		callback(true);
		//create session here??
		socket.username = data;
		io.emit("new login", socket.username);
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
