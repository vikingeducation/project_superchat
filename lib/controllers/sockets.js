const socketio = require("socket.io");
const chat = require("../chat");

function init(server) {
  const io = socketio(server);
  // socket stuff

  io.on("connection", client => {
    let userName = "";

    client.on("registerUser", newUserName => {
      console.log(`New user connected: ${newUserName}`);
      userName = newUserName;
    });
    client.on("checkRoomName", (roomName, callback) => {
      //check the room Name
      chat.checkRoomName(roomName).then(answer => {
        if (answer) {
          chat.addRoom(roomName);
        }
        callback(answer);
      });
    });

    client.on("addPost", (roomName, message) => {
      chat
        .addMessage(roomName, userName, message)
        .then(messageObj => {
          io.emit("addPost", messageObj);
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
  return io;
}

module.exports = init;
