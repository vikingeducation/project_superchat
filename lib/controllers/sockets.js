const socketio = require("socket.io");
const chat = require("../chat");

function init(server) {
  const io = socketio(server);

  io.on("connection", client => {
    let userName = "";
    let currentRooms = {};

    client.on("registerUser", newUserName => {
      console.log(`New user connected: ${newUserName}`);
      userName = newUserName;
    });

    client.on("leaveRoom", roomName => {
      currentRooms[roomName] = undefined;
    });

    client.on("deleteRoom", roomName => {
      chat.removeRoom(roomName);
      io.emit("delRoom", roomName);
    });

    client.on("tryAddRoom", roomName => {
      chat.checkRoomName(roomName).then(available => {
        if (available) {
          chat.addRoom(roomName);
          io.emit("addNewRoom", roomName);
        } else client.emit("badNewRoom");
      });
    });

    client.on("tryJoinRoom", roomName => {
      if (!currentRooms[roomName]) {
        currentRooms[roomName] = true;
        client.emit("joinRoom", roomName);
        chat
          .getMessages(roomName)
          .then(messageArr => {
            messageArr.forEach(messageObj => {
              client.emit("addPost", messageObj);
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
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
