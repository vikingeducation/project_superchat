const socketio = require("socket.io");
const chat = require("../chat");

function init(server) {
  const io = socketio(server);
  // socket stuff

  io.on("connection", client => {
    console.log("new user connected!");

    client.on("addPost", (roomName, author, message) => {
      chat.addMessage(roomName, author, message).then(messageObj => {
        io.emit("addPost", messageObj);
      });
    });

    client.on("logOut", userName => {
      console.log(userName);
      chat.removeUser(userName).then(result => {
        console.log(`Name Removed(?): ${result}`);
      });
    });

    client.on("checkUsername", userName => {
      chat
        .checkUserName(userName)
        .then(available => {
          if (!available) client.emit("invalidUserName");
          else {
            chat.addUser(userName);
            client.emit("addRoom", "Room of Requirement");
            chat.addRoom("Room of Requirement");
            client.emit("validUserName", userName);
            chat.getMessages("Room of Requirement").then(messageArr => {
              messageArr.forEach(messageObj => {
                client.emit("addPost", messageObj);
              });
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
  return io;
}

module.exports = init;
