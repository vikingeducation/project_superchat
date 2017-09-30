const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

//superchat
const superchat = require("./modules/superchat");

//for body parsing
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//session cookies
var cookieSession = require("cookie-session");
app.use(
	cookieSession({
		name: "session1",
		keys: ["123456789abcefgh"]
	})
);

//use styles
app.use(express.static(__dirname + "/public"));

//handlebars
const exphbs = require("express-handlebars");
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main",
		partialsDir: "views/partials/"
	})
);
app.set("view engine", "handlebars");

//GETS

//get login or redirect
app.get("/", (req, res) => {
	var username = req.cookies["username"];
	if (username == "" || username == undefined) {
		res.render("login");
	} else {
		res.redirect(`/rooms/${username}`);
	}
});

//getroompage
app.get("/rooms/:username", (req, res) => {
	var username = req.cookies["username"];
	superchat
		.readList("rooms")
		.then(rooms => {
			res.render("rooms", { username, rooms });
		})
		.catch(err => {
			if (err) {
				console.error(err);
			}
		});
});

//get chatroom
app.get("/rooms/:username/chat/:room", (req, res) => {
	var username = req.cookies["username"];
	var room = req.params.room;
	Promise.all([
		superchat.readList(`${room}Users`),
		superchat.readList(`${room}Messages`)
	])
		.then(chatObj => {
			let users = chatObj[0];
			let messages = chatObj[1];
			res.render("index", { username, room, users, messages });
		})
		.catch(err => {
			if (err) {
				console.error(err);
			}
		});
});

//POSTS

//post coookie for username
app.post("/", (req, res) => {
	var username = req.body.username;
	if (username == "") {
		res.redirect("/");
	} else {
		res.cookie("username", username);
		res.redirect(`/rooms/${username}`);
	}
});

//delete username cookie
app.post("/logout", (req, res) => {
	res.clearCookie("username");
	res.redirect("/");
});

//SOCKETS

io.on("connection", socket => {
	//messages
	socket.on("chat message", function(chat) {
		superchat.saveChatUsr(chat.usr, chat.room);
		superchat.saveChatMsg(chat.msg, chat.room);
		io.emit("chat message", chat);
		//console.log(`message: ${chat.usr}: ${chat.msg} in room ${chat.room}`);
	});

	//rooms
	socket.on("new room", function(room) {
		superchat.addNewRoom(room);
		io.emit("new room", room);
	});
});

server.listen(3000, () => {
	console.log("listening on localhost3000");
});
