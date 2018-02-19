

var socket = io.connect('http://localhost:3000');
socket.on('chat', (body, userName, roomName)=> {
  $('.chat.room > .clear').after('<div class="chat-row">' +  '<h5 id="output-author">' + userName + '</h5>' + '<p id="output-msg">' + body + '</p><hr></div>');
})

socket.on('room', (roomName)=> {
  $('.chat.rooms > .chat.room').after('<div class="chat-row">' +  '<h5>' + roomName + '</h5>' + '<p>1 Member</p><hr></div>');
})
