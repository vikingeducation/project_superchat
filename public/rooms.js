$(() => {
  roomClient.init();
  roomServer.init();
});

let roomClient = {
  init: () => {
    $("#rooms").on("click", ".leave", roomClient.handleLeave);
    $("#rooms").on("click", ".delete", roomClient.handleDel);
    $("#roomsListForm").on("click", "button", roomClient.handleAdd);
    $("#roomsListForm").on("keydown", "input", roomClient.handleAddEnter);
    $("#roomsList").on("click", "button", roomClient.handleJoin);
  },
  remove: (element, roomName) => {
    $(`${element}[data-id="${roomName}"]`).remove();
  },
  handleDel: event => {
    let roomName = roomClient.handleLeave(event);
    roomClient.remove("button", roomName);
    socket.emit("deleteRoom", roomName);
  },
  handleLeave: event => {
    let roomName = $(event.target).attr("data-id");
    roomClient.remove("article", roomName);
    socket.emit("leaveRoom", roomName);
    return roomName;
  },
  handleJoin: event => {
    let roomName = $(event.target).attr("data-id");
    socket.emit("tryJoinRoom", roomName);
  },
  handleAdd: event => {
    event.preventDefault();
    let $input = $("#roomsListForm input");
    socket.emit("checkRoomName", $input.val());
    $input.val("");
  },
  handleAddEnter: event => {
    if (event.keyCode === 13) roomClient.handleAdd(event);
  }
};

let roomServer = {
  init: () => {
    socket.on("addNewRoom", roomServer.handleAdd);
    socket.on("badNewRoom", roomServer.handleBad);
    socket.on("joinRoom", roomServer.handleJoin);
  },
  handleAdd: roomName => {
    let newRoom = templates.roomButton(roomName);
    $("#roomsList article").append($(newRoom));
  },
  handleJoin: roomName => {
    let newRoom = templates.room(roomName);
    $("#rooms").append(newRoom);
  },
  handleBad: () => alert("That room already exists, just join it, silly.")
};
