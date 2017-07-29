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
        else _acceptLogIn(io, req, res, userName, userId);
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
      if (available) _acceptLogIn(io, req, res, userName, userId);
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
    //"Logged Out"
    res.end();
  });
  return router;
}

// Log. In.
function _acceptLogIn(io, req, res, userName, userId) {
  chat.addUser(userName);
  io.sockets.connected[userId].emit("validUserName", userName);
  // initializing our room should be initializing list of rooms

  //get some rooms, and add them to the list
  //chat.addRoom(roomName);
  //chat
  chat.getAllRooms().then(roomNameArr => {
    roomNameArr.forEach(roomName => {
      io.sockets.connected[userId].emit("addNewRoom", roomName);
    });
  });

  // User Logged In
  req.session.superChatUserName = userName;
  res.end();
}

// Denied.
function _denyLogIn(io, res, userId, startup) {
  io.sockets.connected[userId].emit("invalidUserName", startup);
  // Log In Failed
  res.end();
}
module.exports = init;
