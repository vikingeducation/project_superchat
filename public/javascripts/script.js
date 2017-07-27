var socket = io.connect("http://localhost:3030");

let formHandler = function() {
  $(".messageForm").on("submit", e => {
    e.preventDefault();
    var data = {};
    data.body = $("input[name='message']").val();
    $("input").val("");
    data.author = document.cookie.replace(
      /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    data.author = data.author.replace("%20", " ");
    data.room = $(".messageForm").attr("id");
    console.log(data.room);
    socket.emit("newMessage", data);
  });
};

$(document).ready(function() {
  $("#create-room").on("submit", e => {
    e.preventDefault();
    let data = $("#create-room-form").val();
    socket.emit("newRoom", data);
  });

  $("#rooms").on("click", ".room", e => {
    let $target = $(e.target);
    let roomName = $target.parent().attr("id");
    console.log(roomName);
    socket.emit("showRoom", roomName);
  });

  socket.on("updateMessages", data => {
    console.log(data);
    console.log(data.room);

    $(`#messages${data.room}`).prepend(
      $(
        `<div class='message row'><div class='col-xs-12'><p><span>${data.author}: </span>${data.body}</p></div></div>`
      )
    );
    if ($(`#messages${data.room}`).length === 0) {
      $(`#newMessage${data.room}`).text("new message");
    }
  });

  socket.on("updateRooms", data => {
    $("#rooms").prepend(
      $(
        `<div class='room' id="${data}"><h3>${data}</h3><span id="newMessage${data}"></span></div>`
      )
    );
  });

  socket.on("roomLoaded", output => {
    let messageFormHBS = Handlebars.templates["message_form"](output);
    $messages = $("#messageContainer");
    $messages.empty();
    $messages.append(messageFormHBS);
    $messages.parent().addClass("panel panel-default");
    $messages.addClass("panel-body");
    formHandler();
  });
});
