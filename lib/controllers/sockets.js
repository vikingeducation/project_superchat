const socketio = require("socket.io");
const chat = require("../chat");

function init(server) {
  const io = socketio(server);
  // socket stuff

  io.on("connection", client => {
    client.emit("addRoom", "Room of Requirement");
    chat.addRoom("Room of Requirement");

    client.on("addPost", (roomName, author, message) => {
      chat.addMessage(roomName, author, message).then( (messageObj){
        io.to(roomName).emit('addPost', messageObj);
      })

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
