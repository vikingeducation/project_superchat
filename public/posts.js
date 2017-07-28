$(() => {
  postListeners.init();
});

let postListeners = {
  init: () => {
    $("#rooms").on("click", "button", postListeners.handleNew);
    $("#rooms").on("keydown", "input", postListeners.handleNewEnter);
    socket.on("addPost", postListeners.handleAdd);
  },
  handleNew: event => {
    event.preventDefault();
    let $room = $(event.target).closest("article");
    let roomName = $room.attr("data-id");
    let $textBox = $room.find("input");
    let message = $textBox.val();
    $textBox.val("");
    socket.emit("addPost", roomName, message);
  },
  handleNewEnter: event => {
    if (event.keyCode === 13) postListeners.handleNew(event);
  },
  handleAdd: messageObj => {
    let messageElement = templates.message(messageObj);
    let targetText = '[data-id="' + messageObj.roomName + '"]';
    $(targetText).children("ul").prepend(messageElement);
  }
};
