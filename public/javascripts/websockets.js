$(document).ready(function(){
  var socket = io.connect('http://localhost:3000');

  $('.room').click(function(){
    socket.emit('show messages', $(this).text())
  })

  socket.on('show messages', function(roomObj){
    $('#roommessages').removeClass('hidden');
    $('#message-form').removeClass('hidden');
    $parentUl = $('#roommessages');
    $parentUl.html('<ul></ul>');
    var $roomName = $('<h2></h2>')
    .text(roomObj.roomName);
    $('#roommessages').prepend($roomName);
    for (let i=0; i<roomObj.messages.length; i++) {
      addMessage($parentUl, roomObj.messages[i]);
    }
  })

  $('#submit-message').click(function(){
    var body = $('#new-message').text();
    var roomName = $('#roommessages h2').text();
    socket.emit('new message', {body, roomName});
  })

  socket.on('new message', function(messageObj){
    $parentUl = $('#roommessages ul');
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

  parent.append($messageLi);
}



// socket.on('new count', function(obj) {
//     var id = '#' + obj.id;
//     $(id).text(obj.clicks);
//   });
