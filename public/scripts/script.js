const port = 3030;
const socket = io.connect(`http://localhost:${ port }`);

const $chatMessages = $('#chat-messages');

const appendMessages = messages => {
    messages.forEach(message => {
      message = JSON.parse(message);
      $chatMessages.append(`<p><strong>User:</strong> ${message.author}</p>`);
      $chatMessages.append(`<p><strong>Message:</strong> ${message.text}</p>`);
      $chatMessages.append('<hr>');
    });
};

socket.on('new message', messages => {
  // should be a conditional here that checks chatroom
  $chatMessages.html('');
  if (messages.length === 0) {
    $chatMessages.append('<p>Nothing here yet!</p>');
    console.log('hi');
  } else {
    appendMessages(messages);
  }
});