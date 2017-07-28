const router = require("express").Router();
const chat = require("../chat");

function init(io) {
  // Display the page!
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
    let userSocket = io.sockets.connected[userId];
    if (userName) {
      chat
        .checkUserName(userName)
        .then(notInDB => {
          if (notInDB) res.end();
          else _acceptLogIn(req, res, userName, userSocket);
        })
        .catch(err => console.error(err));
    } else res.end();
  });

  // Check if user already exists is in database
  // If so, log them in
  // If not, tell them and show the login form again
  router.get("/login/:id/:username", (req, res) => {
    let userName = req.params.username;
    let userId = req.params.id;
    let userSocket = io.sockets.connected[userId];
    chat
      .checkUserName(userName)
      .then(available => {
        if (available) _acceptLogIn(req, res, userName, userSocket);
        else {
          userSocket.emit("invalidUserName");
          res.end();
        }
      })
      .catch(err => console.error(err));
  });

  // Remove user from database
  // Unset session
  router.get("/logout", (req, res) => {
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

// Add user to database, trigger front end log in
// Grab all the rooms and send them to the user
// Add user to the session
function _acceptLogIn(req, res, userName, userSocket) {
  chat.addUser(userName).catch(err => {
    if (err) console.error(err);
  });
  userSocket.emit("validUserName", userName);
  chat
    .getAllRooms()
    .then(roomNameArr => {
      roomNameArr.forEach(roomName => userSocket.emit("addNewRoom", roomName));
    })
    .catch(err => {
      if (err) console.error(err);
    });
  req.session.superChatUserName = userName;
  res.end();
}

module.exports = init;
