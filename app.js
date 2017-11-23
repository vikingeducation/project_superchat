const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const redisClient = require("redis").createClient();
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

//morgan toolkit
// const morgan = require("morgan");
// const morganToolkit = require("morgan-toolkit")(morgan);

app.use(cookieParser());

// app.use(morganToolkit());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

redisClient.on("error", function(err) {
  console.log("Error " + err);
});

const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);

app.use(express.static(__dirname + "/public"));

let firstmessageArr = []; // this is the message array for ./
app.get("/", (req, res) => {
  redisClient.KEYS("*", (err, keys) => {
    keys.forEach(key => {
      redisClient.hgetall(key, (err, obj) => {
        firstmessageArr.push(obj);
      });
    });
  });

  let allMessageChatrooms = firstmessageArr.map(obj => {
    return obj.chatroom;
  });

  var uniqueChatroomsArr = [];
  allMessageChatrooms.forEach(item => {
    if (!uniqueChatroomsArr.includes(item)) {
      uniqueChatroomsArr.push(item);
    }
  });

  if (req.cookies.username) {
    res.render("index", {
      username: req.cookies.username,
      messages: firstmessageArr,
      chatroomName: req.params.chatroomName,
      chatroomList: uniqueChatroomsArr
    });
  } else {
    res.render("login", {});
  }
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/");
});

app.post("/chatroom/signout", (req, res) => {
  res.render("login", {});
});

let messageArr = []; // this is the message array for ./chatroom/newpost
app.post("/chatroom/newpost", (req, res) => {
  let username = req.cookies.username;
  let content = req.body.newpost;
  let chatroom = req.body.chatroomId.toString().toLowerCase();
  let randomNum = Math.random();
  let messageId = chatroom + String(randomNum);

  //checks to make sure messageiD is unique and if it is set it with hmset
  redisClient.KEYS(messageId, (err, key) => {
    if (err) {
      redisClient.hmset(
        messageId,
        {
          username,
          content,
          chatroom
        },
        (error, result) => {
          if (error) res.send("Error: " + error);
          redisClient.hgetall(messageId, (err, obj) => {
            messageArr.push(obj);
            io.emit("update", "data");
            // res.render("index", {
            //   messages: messageArr,
            //   username: req.cookies.username
            // });
            res.redirect("/chatroom/" + obj.chatroom);
          });
        }
      );
    } else {
      messageId = chatroom + String(Math.random());
      redisClient.hmset(
        messageId,
        {
          username,
          content,
          chatroom
        },
        (error, result) => {
          if (error) res.send("Error: " + error);

          redisClient.hgetall(messageId, (err, obj) => {
            messageArr.push(obj);
            io.emit("update", "data");
            // res.render("index", {
            //   messages: messageArr,
            //   username: req.cookies.username
            // });
            res.redirect("/chatroom/" + obj.chatroom);
          });
        }
      );
    }
  });
});

app.get("/chatroom/:chatroomName", (req, res) => {
  //this doesn't work yet.
  let firstmessageArrPromise = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  let chatroomMessagesArr;
  let allMessageChatrooms;
  let uniqueChatroomsArr;

  firstmessageArrPromise()
    .then(data => {
      if (firstmessageArr.length === 0) {
        console.log("firstmessageArr.length === 0 ran");
        redisClient.KEYS("*", (err, keys) => {
          keys.forEach(key => {
            redisClient.hgetall(key, (err, obj) => {
              firstmessageArr.push(obj);
              console.log("pushing");
            });
          });
        });
      }
    })
    .then(data => {
      console.log("firstmessageArr:" + firstmessageArr);
    })
    .then(data => {
      chatroomMessagesArr = firstmessageArr.filter(obj => {
        if (obj.chatroom === req.params.chatroomName) {
          console.log("firstmessageArr filtering");
          return true;
        }
      });
      console.log("chatroomMessagesArr" + chatroomMessagesArr);
    })
    .then(data => {
      allMessageChatrooms = firstmessageArr.map(obj => {
        return obj.chatroom;
      });
    })
    .then(data => {
      uniqueChatroomsArr = [];
      allMessageChatrooms.forEach(item => {
        if (!uniqueChatroomsArr.includes(item)) {
          uniqueChatroomsArr.push(item);
        }
      });
    })
    .then(() => {
      res.render("index", {
        username: req.cookies.username,
        messages: chatroomMessagesArr,
        chatroomName: req.params.chatroomName,
        chatroomList: uniqueChatroomsArr
      });
    })
    .catch(err => console.log(err));
  /*
    //chris
    app.get("/chatroom/:chatroomName", (req, res) => {
      let firstmessageArrPromise = () => {
        return new Promise((resolve, reject) => {
          redisClient.KEYS("*", (err, keys) => err ? reject(err) : resolve(keys));
        });
      };

      let chatroomMessagesArr;
      let allMessageChatrooms;
      let uniqueChatroomsArr;

      firstmessageArrPromise()
        .then(keys => {
          const promises = [];
          keys.forEach(key => {
            const promise = new Promise((resolve, reject) => {
              redisClient.hgetall(
                key, (err, obj) => err ? reject(err) : resolve(obj)
              );
            });
            promises.push(promise);
          });
          return Promise.all(promises);
        })
        .then(values => {
          // ????
        })
        .then(data => {
          chatroomMessagesArr = firstmessageArr.filter(obj => {
            if (obj.chatroom === req.params.chatroomName) {
              console.log("firstmessageArr filtering");
              return true;
            }
          });
          console.log("chatroomMessagesArr" + chatroomMessagesArr);
        })
        .then(data => {
          allMessageChatrooms = firstmessageArr.map(obj => {
            return obj.chatroom;
          });
        })
        .then(data => {
          uniqueChatroomsArr = [];
          allMessageChatrooms.forEach(item => {
            if (!uniqueChatroomsArr.includes(item)) {
              uniqueChatroomsArr.push(item);
            }
          });
        })
        .then(() => {
          res.render("index", {
            username: req.cookies.username,
            messages: chatroomMessagesArr,
            chatroomName: req.params.chatroomName,
            chatroomList: uniqueChatroomsArr
          });
        })
        .catch(err => console.log(err));
    });
    */
});

server.listen(3000);
