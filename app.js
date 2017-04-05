const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const cookieParser = require("cookie-parser");
const ioOps = require("./lib/ioOps");
const redisOps = require('./lib/redisOps');




//Require routes
const index = require("./routes/index.js");

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
    client.emit("connection");
    //new room
    console.log("after the emit connection");
    //ioOps.newRoom(name)
    client.on('new room', (data) => {
        console.log(`data from client ${ data }`);
        redisOps.createChatRoom(data);
        //io.emit(new room) tells all the clients to update their rooms
        
        let stringOHTML = ioOps.makeNewRoomHTML(data);
        io.emit('new room', stringOHTML);
        
        
        
        

    });
});

server.listen(process.env.PORT || 3000);
