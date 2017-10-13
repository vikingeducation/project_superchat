$(document).ready(() => {
  // scroll to bottom of message
  scrollToBottom();
  var username = getCookie('currentUser');

  var socket = io.connect('http://localhost:3000');

  $('#new-message-form').submit((e) => {
    e.preventDefault();

    var leadingHr = true;
    if ($('#no-message-alert').length) { leadingHr = false }

    var messageInfo = {
      body: $('#message').val().trim(),
      createdAt: new Date(),
      leadingHr: leadingHr
    };

    // clear message
    $('#message').val('');

    socket.emit('new-message', messageInfo, username);
  });

  socket.on('render-message', (partial) => {

    if ($('#no-message-alert').length) {
      $('#no-message-alert').remove();
    }

    $('#messages-scroller').append(partial);
    scrollToBottom();
  });

  $("#save-chat-room").click(() => {
    var roomName = $("#room-name").val().trim();

    if (roomName && roomName !== '') {
      socket.emit('new-room-name', roomName, username);
    } else {
      $("#room-name-error").removeClass('hidden');
    }
  });

  socket.on('room-name-taken', () => {
    $("#room-name").val('');
    $("#room-already-exists").removeClass('hidden');
  });

  socket.on('new-room', partial => {
    $("#room-name-error").addClass('hidden');
    $("#room-already-exists").addClass('hidden');
    $("#room-name").val('');
    $('#newChat').modal('hide');
    $("#chat-list").prepend(partial);
  });
});

const scrollToBottom = () => {
  $("#messages-scroller").animate({
    scrollTop: $('#messages-scroller')
    .prop("scrollHeight")},
  1000);
};

const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};
