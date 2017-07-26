const socket = io.connect("http://localhost:4000");

// $("#submitPost").submit((e) => {
// 	e.preventDefault();
// 	socket.emit("newChat", $("#message").val());
// 	console.log("also working");
// });

$("#submitPost").on("click", e => {
  e.preventDefault();
  socket.emit("newChatMessage", {
    userName: $(".storedName").text(),
    message: $(".message").val()
  });
});



socket.on("newChatMessageFromServer", newChatMessage => {
  console.log("working");
  $(".messages").append($(`<h3>Author: ${newChatMessage.userName}</h3>`))
  $(".messages").append($(`<p>Message: ${newChatMessage.message}</p>`))
});

//
