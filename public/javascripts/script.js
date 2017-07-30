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
    socket.emit("newMessage", data);
  });
};

let onLeaveRoom = function() {
  $(".leaveRoom").on("click", function(e) {
    e.stopPropagation();
    let roomName = $(this).parent().parent().attr("id");
    socket.emit("leaveRoom", roomName);
  });
};

$(document).ready(function() {
  // Emit events

  $("#create-room").on("submit", e => {
    e.preventDefault();
    let data = $("#create-room-form").val();
    $("#create-room-form").val("");
    socket.emit("newRoom", data);
  });

  $("#rooms").on("click", ".room", e => {
    let $target = $(e.target);
    let roomName = $target.parent().attr("id");
    socket.emit("showRoom", roomName);
  });

  // Listen for events

  socket.on("updateMessages", data => {
    $(`#messages${data.room}`).prepend(
      $(`<div class='message row'>
          <div class='col-xs-12'>
            <p><span class="author">${data.author}: </span>${data.body}</p>
          </div>
        </div>`)
    );
    if ($(`#messages${data.room}`).length === 0) {
      $(`#newMessage${data.room}`).text("new");
    }
  });

  socket.on("updateRooms", data => {
    $("#rooms").prepend(
      $(`<div class='room' id="${data}">
          <h3>
            <span class="leaveRoom">X</span>
            ${data}
            <span id="newMessage${data}" class="label label-danger"></span>
          </h3>
        </div>`)
    );

    onLeaveRoom();
  });

  socket.on("roomLoaded", output => {
    let messageFormHBS = Handlebars.templates["message_form"](output);
    $(".active").removeClass("active");
    $(`div#${output.room}`).addClass("active");
    $messages = $("#messageContainer");
    $messages.empty().append(messageFormHBS).addClass("panel-body");
    $messages.parent().addClass("panel panel-default");
    $(`#${output.room} span.label`).text("");
    formHandler();
  });

  socket.on("leftRoom", room => {
    $(`#${room}`).remove();
  });

  onLeaveRoom();
});
