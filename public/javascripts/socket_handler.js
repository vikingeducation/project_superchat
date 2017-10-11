$(document).ready(() => {
  // scroll to bottom of message
  $("#messages-scroller").animate({
    scrollTop: $('#messages-scroller')
    .prop("scrollHeight")},
  1000);

  var socket = io.connect('http://localhost:3000');

  socket.emit('hello');

  // socket.on('increment-clicks', (id) => {
  //   var clickCount = $(`#${ id }`);
  //   var currentVal = parseInt(clickCount.text());
  //   clickCount.text(currentVal + 1);
  // });
});
