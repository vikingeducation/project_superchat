// socket.on('count', (selector, totalClicks)=> {
//   console.log(selector);
//   console.log(totalClicks)
//   $('#' + selector).last().text(totalClicks);
// })


var socket = io.connect('http://localhost:3000');
socket.on('chat', (body, userName, roomName)=> {
  $('.chat.room > .clear').after('<div class="chat-row">' +  '<h5 id="output-author">' + userName + '</h5>' + '<p id="output-msg">' + body + '</p><hr></div>');
})

socket.on('room', (roomName)=> {
  $('.chat.room > .clear > /chat.room').after('<div class="chat-row">' +  '<h5>' + roomName + '</h5>' + '<p>1 Member</p><hr></div>');
})



// var $button = $('button');
// $button.on('click', ()=> {
//   socket.emit('click', {
//     'body': $('textarea').text(),
//     'author': 'Anonymous'
//   })
// });

// socket.on('chat', (data)=> {
//
//   $('.chat.room > .clear').after(
//     '<div class="chat-row">' +  '<h5 id="output-author">' + data.author + '</h5>' + '
// <p id="output-msg">' + data.body + '</p><hr></div>');
// })
