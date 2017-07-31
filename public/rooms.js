$(() => {
  roomClient.init();
  roomServer.init();
});

let roomClient = {
  init: () => {
    $("#rooms").on("click", ".leave", roomClient.handleLeave);
    $("#rooms").on("click", ".delete", roomClient.handleDel);
    $("#roomsListForm").on("click", "button.create", roomClient.handleAdd);
    $("#roomsListForm").on(
      "keydown",
      "input.create",
      roomClient.handleAddEnter
    );
    $("#roomsList").on("click", ".room", roomClient.handleJoin);
  },
  handleDel: event => {
    socket.emit("deleteRoom", $(event.target).attr("data-id"));
  },
  handleLeave: event => {
    let roomName = $(event.target).attr("data-id");
    roomActions.leave(roomName);
    socket.emit("leaveRoom", roomName);
  },
  handleJoin: event => {
    let roomName = $(event.target).attr("data-id");
    socket.emit("tryJoinRoom", roomName);
  },
  handleAdd: event => {
    event.preventDefault();
    let $input = $("#roomsListForm input");
    socket.emit("tryAddRoom", $input.val());
    $input.val("");
  },
  handleAddEnter: event => {
    if (event.keyCode === 13) roomClient.handleAdd(event);
  }
};

let roomActions = {
  remove: (element, roomName) => {
    $(`${element}[data-id="${roomName}"]`).remove();
  },
  delete: roomName => {
    roomActions.remove("button", roomName);
  },
  leave: roomName => {
    roomActions.remove("article", roomName);
  }
};

let roomServer = {
  init: () => {
    socket.on("addNewRoom", roomServer.handleAdd);
    socket.on("badNewRoom", roomServer.handleBad);
    socket.on("joinRoom", roomServer.handleJoin);
    socket.on("delRoom", roomServer.handleDel);
  },
  handleAdd: roomName => {
    let newRoom = templates.roomButton(roomName);
    $("#roomsList article").append($(newRoom));
  },
  handleJoin: roomName => {
    let newRoom = templates.room(roomName);
    $("#rooms").append(newRoom);
  },
  handleBad: () => alert("That room already exists, just join it, silly."),
  handleDel: roomName => {
    roomActions.leave(roomName);
    roomActions.delete(roomName);
    socket.emit("leaveRoom", roomName);
  }
};
