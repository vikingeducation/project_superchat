const socket = io.connect("http://localhost:3000");

$("#createRoom").on("click", e => {
  e.preventDefault();
  socket.emit("newChatRoom", {
    roomName: $(".roomName").text()
  });
});

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
  var list = document.getElementById("msgList");
  var newItem = document.createElement("LI");

  var textnode = document.createTextNode(
    newChatMessage.userName + " : " + newChatMessage.message
  );
  newItem.appendChild(textnode);
  list.insertBefore(newItem, list.childNodes[0]);

  //$(".messages").append($(`<li >Author: ${newChatMessage.userName}</li>`));
  //$(".messages").append($(`<li >Message: ${newChatMessage.message}</li>`));
});

//
