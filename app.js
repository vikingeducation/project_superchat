const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

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

app.get("/", (req, res) => {
	var username = req.cookies["username"];
	if (username == "" || username == undefined) {
		res.render("login");
	} else {
		res.redirect(`/chat/${username}`);
	}
});

app.post("/", (req, res) => {
	var username = req.body.username;
	if (username == "") {
		res.redirect("/");
	} else {
		res.cookie("username", username);
		res.redirect(`/chat/${username}`);
	}
});

app.post("/logout", (req, res) => {
	res.clearCookie("username");
	res.redirect("/");
});

app.get("/chat/:username", (req, res) => {
	var username = req.cookies["username"];
	res.render("index", { username });
});

io.on("connection", socket => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("chat message", function(msg) {
		io.emit("chat message", msg);
		console.log("message " + msg);
	});
});

server.listen(3000, () => {
	console.log("listening on localhost3000");
});
