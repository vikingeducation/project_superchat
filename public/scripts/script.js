$(() => {
  const port = 3031;
  const socket = io.connect(`http://localhost:${ port }`);
  const $chatMessages = $('#chat-messages');
  const $roomsList = $('#rooms');
  let thisChatroom = $('#room-id').text();
  let updateRoomPosts = `update ${ thisChatroom } posts`;

  const appendMessages = messages => {
      messages.forEach(message => {
        message = JSON.parse(message);
        $chatMessages.append(`<p><strong>User:</strong> ${message.author}</p>`);
        $chatMessages.append(`<p><strong>Date:</strong> ${message.date}</p>`);
        $chatMessages.append(`<p><strong>Message:</strong> ${message.text}</p>`);
        $chatMessages.append('<hr>');
      });
  };

  const appendRooms = rooms => {
      rooms.forEach(room => {
        $roomsList.append(`<p><strong>Room:</strong> <a href="/chatroom/${ room }"><span class="each-room">${ room }</span></a></p>`);
        $roomsList.append('<hr>');
      });
  };

  socket.on('update rooms', rooms => {
    $roomsList.html('');
    if (rooms.length === 0) {
      $roomsList.append('<p>No rooms created yet! Why not make the first one yourself?</p>');
    } else {
      appendRooms(rooms);
    }
  });

  socket.on(updateRoomPosts, messages => {
    $chatMessages.html('');
    if (messages.length === 0) {
      $chatMessages.append('<p>Nothing here yet!</p>');
    } else {
      appendMessages(messages.reverse());
    }
  });
});