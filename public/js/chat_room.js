const socket = io.connect("http://localhost:3000");

// $(".roomName").text();
// $(".storedName").text();


$("#createMessage").on("click", e => {
  e.preventDefault();
  socket.emit("newMessage", {
    roomName: ($(".roomName").val()),
    username: ($(".storedName").text()),
    message: ($("message").val())
  }
  
