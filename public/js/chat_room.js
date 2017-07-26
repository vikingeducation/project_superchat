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
socket.on("ChatFromLogin", newChatMessageArray => {
  console.log("working");
  let k = 0;
  while (k < newChatMessageArray.length) {
    $(".messages").append($(`<h3 >${newChatMessageArray[k]}</h3>`));

    k++;
  }
});
socket.on("newChatMessageFromServer", newChatMessage => {
  console.log("working");
  $(".messages").append(
    $(`<h3 float:top>Author: ${newChatMessage.userName}</h3>`)
  );
  $(".messages").append(
    $(`<p float:top>Message: ${newChatMessage.message}</p>`)
  );
});

//
