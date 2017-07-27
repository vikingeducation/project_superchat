const socket = io.connect("http://localhost:3000");

// $(".roomName").text();
// $(".storedName").text();
socket.on("newMessageFromServer", newChatMessage => {
  let chatMessage = createNewMessage(newChatMessage);
  $("#PostedMessages").prepend($(`${chatMessage}`));
});

function createNewMessage(passedMessage) {
  console.log(passedMessage);
  return `
  <h3>Author: ${passedMessage.username} </h3>
  <p><strong>Message:</strong> ${passedMessage.message} </p>
  `;
}

$("#submitPost").on("click", e => {
  console.log("fjfjf");
  e.preventDefault();
  socket.emit("newMessage", {
    username: $(".storedName").text(),
    message: $(".message").val()
  });
});
