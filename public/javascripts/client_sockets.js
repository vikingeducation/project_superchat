var socket = io.connect('http://localhost:3000')
var activeRoom = null;
var activeUser = $('.username').html();

console.log(activeUser);

socket.on('updateCount', function(data) {
  $('#' + data.shortURL + '-count').html(data.count)
});

socket.on('newRoom', function(data) {
  $('#roomList').append('<li class="list-group-item">' + data + '<button type="button" class="btn btn-info button-format btn-xs room-button" name="' + data + '">Show</button></li>');
});

socket.on('messageList', function(data) {
  console.log(data);
  if (data.length !== 0) {
    data.forEach(function(entry) {
      $('#messageList').append('<li class="list-group-item message-detail"><b>' + entry.sender + '</b>: ' + entry.text + '</li>');
    });
  };
});

socket.on('newMessage', function(data) {
  if (activeRoom === data.room) {
    $('#messageList').append('<li class="list-group-item message-detail"><b>' + data.user + '</b>: ' + data.text + '</li>');
  } else {
    let selector = '[name="' + data.room + '"]';
    $(selector).removeClass('btn-info');
    $(selector).addClass('btn-warning');
  }
});


$('#addRoom').click(function() {
  let roomName = $('#roomValue').val();
  socket.emit('addRoom', roomName);
});

$('#sendMessage').click(function() {
  let messageTxt = $('#messageToSend').val();
  if (activeRoom === null) {
    alert("Select a room first!")
  } else {
    socket.emit('sendMessage', {user: activeUser, room: activeRoom, text: messageTxt});
    $('#messageToSend').val('');
  }

});

$(document).on("click", '.room-button', function() {
  let roomName = $(this).attr("name");
  activeRoom = roomName;
  let selector = '[name="' + roomName + '"]';
  $(selector).removeClass('btn-warning');
  $(selector).addClass('btn-info');
  $('.message-detail').remove();
  socket.emit('getMessages', roomName);
  $('#messageRoomName').html(': ' + roomName);
});
