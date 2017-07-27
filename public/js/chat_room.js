const socket = io.connect("http://localhost:3000");

$("#createRoom").on("click", e => {
  e.preventDefault();
  socket.emit("newChatRoom", $(".roomName").val());
});

// Will add button of new chat room
socket.on("newChatRoomFromServer", newChatRoom => {
  console.log("working Here");
  $("#ChatRoomList").append($(`<button class="${newChatRoom}">${newChatRoom}</button>`));
});

socket.on("updateRooms", roomNames => {
  console.log(roomNames);
  console.log("Wow, so many rooms");
  roomNames.forEach((roomName) => {
    $("#ChatRoomList").append($(`<button class="${roomName}">${roomName}</button>`));
  })
})
