$(document).ready(() => {
  // scroll to bottom of message
  scrollToBottom();
  var username = getCookie('currentUser');

  var socket = io.connect('http://localhost:3000');

  $('#new-message-form').submit((e) => {
    e.preventDefault();

    room = getCookie('chatRoom');
    if (!room) {
      room = 'General';
    }

    var leadingHr = true;
    if ($(`#no-message-alert-${ room }`).length) {
      leadingHr = false;
    }

    var messageInfo = {
      body: $('#message').val().trim(),
      createdAt: new Date(),
      leadingHr: leadingHr,
      room: room
    };

    // clear message
    $('#message').val('');

    socket.emit('new-message', messageInfo, username);
  });

  socket.on('render-message', (partial, room) => {
    $(`#no-message-alert-${ room }`).remove();

    $(`#messages-scroller-${ room }`).append(partial);
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

    $('.room-select').click((room) => {
      var id = room.target.id;
      var roomName = id.slice(5).split('-').join(' ');

      document.cookie = `chatRoom=${ roomName }`;
      document.location = '/';
    });
  });

  $('.join-link').click(e => {
    e.preventDefault();

    var id = e.target.id;
    var info = id.slice(5).split('_');
    var room = info[0];
    var username = info[1];

    socket.emit('join-user', room, username);
  });

  $('.leave-link').click(e => {
    e.preventDefault();

    var id = e.target.id;
    var info = id.slice(6).split('_');
    var room = info[0];
    var username = info[1];

    socket.emit('leave-user', room, username);
  });

  socket.on('refresh', () => {
    document.location = '/';
  });

  socket.on('change-member-count', (room, memberCount) => {
    $(`#member-count-${ room }`).html(`${ memberCount } Members`);
  });
});

const scrollToBottom = () => {
  $(".messages-scroller").animate({
    scrollTop: $('.messages-scroller')
    .prop("scrollHeight")},
  1000);
};

const getCookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};
