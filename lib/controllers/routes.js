const router = require("express").Router();
const chat = require("../chat");

function init(io) {
  router.get("/", (req, res) => {
    res.render("index");
  });

  // Check if user already exists is in database
  // If so, add cookie and kick off login
  // If not, tell them
  router.get("/login/:id/:username", (req, res) => {
    let userName = req.params.username;
    let userId = req.params.id;
    chat.checkUserName(userName).then(available => {
      if (available) {
        _acceptLogIn(io, userName, userId, "Room of Requirement");
        req.session.superChatUserName = userName;
        res.send("Logged In");
      } else {
        io.broadcast.to(userId).emit("invalidUserName");
        res.send("User Name Taken");
      }
    });
  });

  // Remove user from database
  // Unset cookie
  router.get("/logout/:username", (req, res) => {
    let userName = req.params.username;
    chat
      .removeUser(userName)
      .then(result => {
        console.log(`Name Removed(?): ${result}`);
      })
      .catch(err => {
        console.error(err);
      });
    req.session.superChatUserName = undefined;
    res.send("Logged Out");
  });
  return router;
}

// Log. In.
function _acceptLogIn(io, userName, userId, roomName) {
  chat.addUser(userName);
  io.broadcast.to(userId).emit("validUserName", userName);
  // initializing our room should be initializing list of rooms
  chat.addRoom(roomName);
  io.broadcast.to(userId).emit("addRoom", roomName);
  chat
    .getMessages(roomName)
    .then(messageArr => {
      messageArr.forEach(messageObj => {
        io.broadcast.to(userId).emit("addPost", messageObj);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = init;
