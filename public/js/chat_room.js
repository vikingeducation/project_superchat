const socket = io.connect("http://localhost:3000");

// $(".roomName").text();
// $(".storedName").text();
socket.on("newMessageFromServer", newChatMessage => {
  // $("#PostedMessages").prepend(`${newChatMessage}`);
 let newElement = document.createElement("P:"
 newitem.val = newchatMessage.message)

  document
    .getElementById("msgList")
    .prepend($(createNewMessage(newChatMessage)));
});

function createNewMessage(passedMessage) {
  return `
  <h3> ${passedMessage.username} </h3>
  <p> ${passedMessage.message} </p>
  `;
}

$("#submitPost").on("click", e => {
  console.log("fjfjf");
  e.preventDefault();
  socket.emit("newMessage", {
    roomName: $(".roomName").val(),
    username: $(".storedName").text(),
    message: $("message").val()
  });
});
