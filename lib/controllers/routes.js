const router = require("express").Router();
const chat = require("../chat");

function init(io) {
  router.get("/", (req, res) => {
    res.render("index");
  });

  // Check if the client has a session
  // If they do, make sure they exist in the DB
  // If they are, log them in
  // If they aren't or they don't have a session, show the login form
  router.get("/check_login/:id", (req, res) => {
    let userId = req.params.id;
    let userName = req.session.superChatUserName;
    if (userName) {
      chat.checkUserName(userName).then(notInDB => {
        if (notInDB) _denyLogIn(io, res, userId, true);
        else
          _acceptLogIn(io, req, res, userName, userId, "Room of Requirement");
      });
    } else _denyLogIn(io, res, userId, true);
  });

  // Check if user already exists is in database
  // If so, log them in
  // If not, tell them and show the login form again
  router.get("/login/:id/:username", (req, res) => {
    let userName = req.params.username;
    let userId = req.params.id;
    chat.checkUserName(userName).then(available => {
      if (available)
        _acceptLogIn(io, req, res, userName, userId, "Room of Requirement");
      else _denyLogIn(io, res, userId);
    });
  });

  // Remove user from database
  // Unset cookie
  router.get("/logout/", (req, res) => {
    let userName = req.session.superChatUserName;
    chat
      .removeUser(userName)
      .then(result => console.log(`${userName} Logged Out. Removed: ${result}`))
      .catch(err => console.error(err));
    req.session.superChatUserName = undefined;
    res.send("Logged Out");
  });
  return router;
}

// Log. In.
function _acceptLogIn(io, req, res, userName, userId, roomName) {
  chat.addUser(userName);
  io.sockets.connected[userId].emit("validUserName", userName);
  // initializing our room should be initializing list of rooms
  chat.addRoom(roomName);
  io.sockets.connected[userId].emit("addRoom", roomName);
  chat
    .getMessages(roomName)
    .then(messageArr => {
      messageArr.forEach(messageObj => {
        io.sockets.connected[userId].emit("addPost", messageObj);
      });
    })
    .catch(err => {
      console.error(err);
    });

  req.session.superChatUserName = userName;
  res.send("User Logged In");
}

// Denied.
function _denyLogIn(io, res, userId, startup) {
  io.sockets.connected[userId].emit("invalidUserName", startup);
  res.send("Log In Failed");
}
module.exports = init;
