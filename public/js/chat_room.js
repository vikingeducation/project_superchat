const socket = io.connect("http://localhost:3000");

$("#createRoom").on("click", e => {
  e.preventDefault();
  socket.emit("newChatRoom", $(".roomName").val());
});

// Will add button of new chat room
socket.on("newChatRoomFromServer", newChatRoom => {
  console.log("working Here");
  let chatButton = createRoom(roomName);
  $("#ChatRoomList").append($(`<button class="${newChatRoom}">${newChatRoom}</button>`));
});

socket.on("updateRooms", roomNames => {
  console.log(roomNames);
  console.log("Wow, so many rooms");
  roomNames.forEach((roomName) => {
    let chatButton = createRoom(roomName);
    console.log(chatButton);
    $("#ChatRoomList").append($(`${chatButton}`));
  })
})

function createRoom(roomName) {
  return`
    <br>
  <form method="GET" action="/chatrooms/${roomName}">
    <button class="${roomName} submit">${roomName}</button>
  </form>
  <br>
  `
}
