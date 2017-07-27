const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const redisTools = require("./lib/redis_tools");

// const { getUserIds, getUsername } = require("./lib/getUserInfo");
const { getUsernames } = require("./lib/login_redis");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));


app.use("/socket.io", express.static(`${__dirname}/node_modules/socket.io-client/dist/`));
app.use(bodyParser.urlencoded({ extended: true }));

// io.on("connection", client => {
//   redisTools.storeMessage("messages",
//
//   );
//   console.log("working");
//   redisTools.getMessages()
//   .then((messages) => {
//     console.log(typeof messages[6]);
//   })
//
//   redisTools.getMessages().then(
//     newData => {
//       io.emit("ChatFromLogin", newData);
//       console.log(newData);
//     }
//     // resolve();
//   );
//
//   client.on("newChatMessage", newMessage => {
//     redisTools
//       .storeMessage(newMessage)
//       .then(() => {
//         redisTools.getMessages();
//       })
//       .then(
//         data => {
//           console.log(`data: ${data}`);
//         },
//         err => {
//           console.error(err);
//         }
//       );
//
//     io.emit("newChatMessageFromServer", newMessage);
//   });
// });

app.get("/", (req, res) => {
  if (req.cookies.username) {
    console.log(`username: ${req.cookies["username"]}`);
    myUserName = req.cookies.username;
    res.render("chatScreen", { username: myUserName });
  } else {
    res.render("loginScreen");
  }
});

app.post("/", (req, res) => {

  // redisTools.generateUserInfo(req.body.name)
  // .then(() => {
  //   console.log("successfully stored data");
  //   console.log("getting userids");
  //   return getUserIds()
  // })
  // .then((userIds) => {
  //   console.log(`userIds: ${userIds}`);
  //   console.log(`randId: ${userIds[2]}`);
  //   return getUsername(userIds[2])
  // })
  // .then((randUsername) => {
  //   console.log(randUsername);
  //   res.end();
  // })

  // redisTools.getUsernames().then(usernames => {
  //   console.log(usernames);
  //   if (!usernames.includes(req.body.name)) {
  //     res.cookie("username", req.body.name);
  //     redisTools.storeUsername(req.body.name);
  //     res.redirect("/");
  //   } else {
  //     res.end();
  //   }
  // });
});

// var checkUsernameExist = function(name) {
//   return redisTools.getUsernames().includes(name);
// };

server.listen(3000, () => {
  console.log("Serving gormet lobster!");
});
