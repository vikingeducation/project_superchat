$(document).ready(function(){
  var socket = io.connect('http://localhost:3000');
  $('.room').click(function(){
    console.log($(this).text())
    socket.emit('show messages', {name: $(this).text()})
  })
  socket.on('show messages', function(messages){
    $('#roommessages').removeClass('hidden');
    $('#roommessages ul').html('')
    messages.forEach(function(message){
      var $messageLi = $('<li></li>')
      .text(message.body);

      $('#roommessages ul').append($messageLi);
    })
    console.log(messages)
  })
})


// socket.on('new count', function(obj) {
//     var id = '#' + obj.id;
//     $(id).text(obj.clicks);
//   });
