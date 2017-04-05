const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const cookieParser = require("cookie-parser");
const chatOps = require("./lib/chatOps");

//Require routes
const index = require("./routes/index.js")(io);

// Set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up body-parser
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/////////////////////
io.on("connection", client => {
  console.log("New connection!");
  //send the client the data
  //display all message of the default chatroom
  let pro = Promise.all([
    chatOps.buildMessageTable("default"),
    chatOps.buildChatTable()
  ]);
  pro.then(function onFulfilled(infoObj) {
      console.log(`infoObj value is ${ infoObj }`);
    client.emit("connection", { messages: infoObj[0], rooms: infoObj[1] });
  });
  
  client.on("new room", data => {
    //io.emit(new room) tells all the clients to update their rooms
    let pro = chatOps.makeNewRoom(data);
    pro.then(htmlString => {
      if (htmlString) {
        io.emit("new room", htmlString);
      }
    });
  });
  client.on("new message", data => {
    //io.emit(new room) tells all the clients to update their rooms
    let pro = chatOps.makeNewMessage(data);
    pro.then(htmlString => {
      if (htmlString) {
        io.emit("new message", htmlString);
      }
    });
  });
});

server.listen(process.env.PORT || 3000);
