$(document).ready(function(){
  var socket = io.connect('http://localhost:3000');

  $('.room').click(function(){
    socket.emit('show messages', $(this).text())
  })

  socket.on('show messages', function(roomObj){
    $('#roommessages').removeClass('hidden');
    $('#message-form').removeClass('hidden');
    var $roomName = $('<h2></h2>')
    .text(roomObj.roomName);
    $room = $('#roommessages');
    $room.html('');
    $room.append($roomName);
    $room.append('<ul></ul>');

    $list = $('#roommessages ul');

    for (let i=0; i<roomObj.messages.length; i++) {
      addMessage($list, roomObj.messages[i]);
    }

  })

  $('#submit-message').click(function(e){
    e.preventDefault();
    var body = $('#new-message').val();
    var roomName = $('#roommessages h2').text();
    socket.emit('new message', {body, roomName});
  })

  socket.on('new message', function(messageObj){
    $parent = $('#roommessages ul');
    var message = {
      author: messageObj.author,
      body: messageObj.body
    }
    addMessage($parent, message)
  })

})

function addMessage(parent, message) {
  var $author = $('<h4></h4>')
  .text(message.author);
  var $body = $('<p></p>')
  .text(message.body);
  var $messageLi = $('<li></li>')
  .append($author)
  .append($body);

  parent.prepend($messageLi);
}



// socket.on('new count', function(obj) {
//     var id = '#' + obj.id;
//     $(id).text(obj.clicks);
//   });
