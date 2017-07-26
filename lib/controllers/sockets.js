const socketio = require("socket.io");
const chat = require("../chat");

function init(server) {
  const io = socketio(server);
  // socket stuff

  io.on("connection", client => {
    console.log("new user connected!");
    client.emit("addRoom", "Room of Requirement");
    chat.addRoom("Room of Requirement");
    chat.getMessages("Room of Requirement").then(messageArr => {
      //console.log(`Message OBJ: ${messageArr}`);
      messageArr.forEach(messageObj => {
        client.emit("addPost", messageObj);
      });
    });

    client.on("addPost", (roomName, author, message) => {
      chat.addMessage(roomName, author, message).then(messageObj => {
        io.emit("addPost", messageObj);
      });
    });
    //   client.on("addRom", id => {
    //     shortener
    //       .update(id)
    //       .then(urlObj => {
    //         io.emit("update", urlObj);
    //       })
    //       .catch(err => console.error(err.stack));
    //   });
    //
    //   client.on("shorten", url => {
    //     shortener
    //       .shorten(url)
    //       .then(urlObj => {
    //         io.emit("new", urlObj);
    //       })
    //       .catch(err => console.error(err.stack));
    //   });
  });
  return io;
}

module.exports = init;
