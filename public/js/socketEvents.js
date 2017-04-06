$( document ).ready(function() {

  // var socket = io.connect('https://salty-sea-90816.herokuapp.com/');
  var socket = io.connect('http://localhost:3000');

    //Event Listeners
    socket.on('new post', (data, botResponse) => {
      let newPost = data[0];
      let username = data[1];
      let room = data[2];
      console.log(botResponse)
      if ($("#currentRoom").text() === room) {
        $(".messages").append(
          `<li class="left clearfix">
            <span class="chat-img1 pull-left">
              <h6>${username}</h6>
            </span>
            <div class="chat-body1 clearfix">
              <p>${newPost}</p>
            </div>
          </li>`
        );
      }
    });

    socket.on('new room', (newRoom) => {
      $("#rooms").prepend(
        `<li class="left clearfix">
          <div class="chat-body clearfix">
            <div class="header_sec roomName">
              <strong class="primary-font roomText">${newRoom}</strong>
            </div>
          </div>
        </li>`
      )
    });

    socket.on('change room messages', (messages) => {
      $(".messages").empty();
      messages.forEach(message => {
        $(".messages").prepend(
          `<li class="left clearfix">
            <span class="chat-img1 pull-left">
              <h6>${message.username}</h6>
            </span>
            <div class="chat-body1 clearfix">
                <p>${message.body}</p>
            </div>
          </li>`
        )
      })
    })

    //Event Handlers
    $("#sendPost").click(() => {
      let newPost = $("#newPost").val();
      let username = $("#username").text();
      let room = $("#currentRoom").text();
      $("#newPost").val("");
      socket.emit('send post', newPost, username, room);
    });

    $("#addRoom").click(() => {
      let newRoom = $("#newRoom").val();
      $("#newRoom").val("");
      if (newRoom.length) {
        socket.emit('add room', newRoom);
      }
    })

    $("ul#rooms").on("click", ".roomName", (event) => {
      let roomName = $(event.target).find('.roomText').text();
      // if text is clicked, set roomName to text element
      if (!roomName) {
        roomName = $(event.target).text();
      }
      $("#currentRoom").text(roomName);
      socket.emit('change room', roomName);
    })

});