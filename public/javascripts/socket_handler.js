$(document).ready(() => {
  // scroll to bottom of message
  scrollToBottom();

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

    var username = getCookie('currentUser');

    socket.emit('new-message', messageInfo, username);
  });

  socket.on('render-message', (partial) => {

    if ($('#no-message-alert').length) {
      $('#no-message-alert').remove();
    }

    $('#messages-scroller').append(partial);
    scrollToBottom();
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
