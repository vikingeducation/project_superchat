// socket.on('count', (selector, totalClicks)=> {
//   console.log(selector);
//   console.log(totalClicks)
//   $('#' + selector).last().text(totalClicks);
// })

var $button = $('button');

var socket = io.connect('http://localhost:3000');
$button.on('click', ()=> {
  socket.emit('click', {
    'body': $('textarea').text(),
    'author': 'Anonymous'
  })
});

// socket.on('chat', (data)=> {
//
//   $('.chat.room > .clear').after(
//     '<div class="chat-row">' +  '<h5 id="output-author">' + data.author + '</h5>' + '
// <p id="output-msg">' + data.body + '</p><hr></div>');
// })
