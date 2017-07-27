const socket = io.connect("http://localhost:3000");

// $(".roomName").text();
// $(".storedName").text();
socket.on("newMessageFromServer", newChatMessage => {
  document
    .getElementById("msgList")
    .insertBefore(createNewMessage(newChatMessage), list.childNodes[0]);
});

function createNewMessage(passedMessage) {
  return `
  <li> ${passedMessage.username} </li>
    <li> ${passedMessage.message} </li>
  `;
}

$("#createMessage").on("click", e => {
  e.preventDefault();
  socket.emit("newMessage", {
    roomName: $(".roomName").val(),
    username: $(".storedName").text(),
    message: $("message").val()
  });
});
