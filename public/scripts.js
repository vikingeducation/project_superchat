$(handle);
// global socket for testing
const socket = io.connect("http://localhost:3000");

function handle() {
  //let socket = io.connect("http:localhost/3000");

  //send req to server, to check if I'm logged in
  const id = socket.id;
  $.get("/check_login/" + id);

  //Event Listeners here
  // Handle login submit
  $("#login").on("click", "button", event => {
    event.preventDefault();
    let userName = $("#login input").val();
    $.get(`/login/${id}/${userName}`);
  });
  $("#login").on("keydown", "input", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let userName = $("#login input").val();
      $.get(`/login/${id}/${userName}`);
    }
  });

  //leave a room
  $("#rooms").on("click", ".leave", event => {
    let roomName = $(event.target).attr("data-id");
    actions.removeRoomFromPage(roomName);
  });
  //delete a room
  $("#rooms").on("click", ".delete", event => {
    let roomName = $(event.target).attr("data-id");
    actions.removeRoomFromPage(roomName);
    //remove from database
    socket.emit("deleteRoom", roomName);
    let targetText = 'button[data-id="' + roomName + '"]';
    $(targetText).remove();
  });

  // Add new room!
  $("#roomsListForm").on("click", "button", event => {
    event.preventDefault();
    let roomName = $("#roomsListForm input").val();
    actions.onNewRoom(roomName);
  });
  $("#roomsListForm").on("keydown", "input", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let roomName = $("#roomsListForm input").val();
      actions.onNewRoom(roomName);
    }
  });

  // Add a new room to the display
  socket.on("addNewRoom", roomName => {
    actions.buildNewRoom(roomName);
  });

  // Add a new room to the page
  socket.on("joinRoom", roomName => {
    actions.buildRoom(roomName);
  });

  // Handle Joining a room
  $("#roomsList").on("click", "button", event => {
    let roomName = $(event.target).attr("data-id");
    socket.emit("tryJoinRoom", roomName);
  });

  // Handle bad username
  socket.on("invalidUserName", startup => {
    if (startup) {
      $("#login").show();
    } else {
      $("#login input").val("");
      alert("Username already taken. Try Again.");
    }
  });

  // Log in handler
  socket.on("validUserName", userName => {
    $("#login").hide();
    $("#roomsList").show();
    $("#roomsListForm").show();
    socket.emit("registerUser", userName);
    actions.logIn(userName);
  });

  // Log out hander
  $("#userStuff").on("click", "button", event => {
    $("#rooms").empty();
    $("#login").show();
    $("#userStuff").hide();
    $("#roomsList").hide();
    $("#roomsListForm").hide();
    $.get("/logout");
  });

  // Add a new post to a room
  socket.on("addPost", messageObj => {
    actions.buildPost(messageObj);
  });

  // User submits a new post, build it!
  $("#rooms").on("click", "button", event => {
    event.preventDefault();
    actions.newPost(event);
  });
  $("#rooms").on("keydown", "input", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      actions.newPost(event);
    }
  });
}

//Handlers
let actions = {
  buildRoom: function(roomName) {
    let newRoom = templates.room(roomName);
    $("#rooms").append(newRoom);
  },
  buildPost: function(messageObj) {
    let messageElement = templates.message(messageObj);
    let targetText = '[data-id="' + messageObj.roomName + '"]';
    $(targetText).children("ul").prepend(messageElement);
  },
  newPost: function(event) {
    // Get post details, trigger server event
    let $room = $(event.target).closest("article");
    let roomName = $room.attr("data-id");
    let $textBox = $room.find("input");
    let message = $textBox.val();
    $textBox.val("");
    socket.emit("addPost", roomName, message);
  },
  logIn: function(userName) {
    $("#login input").val("");
    $("#login").hide();
    let $userStuff = $("#userStuff");
    $userStuff.show();
    $userStuff.find("h3").text(userName);
  },
  onNewRoom: function(roomName) {
    socket.emit("checkRoomName", roomName, available => {
      $("#roomsListForm input").val("");
      if (available) {
        // Add Room
        actions.buildNewRoom(roomName);
      } else {
        // Or not ;p
        alert("That room already exists, just join it silly billy.");
      }
    });
  },
  buildNewRoom: function(roomName) {
    let newRoom = templates.roomButton(roomName);
    $("#roomsList article").append($(newRoom));
  },
  removeRoomFromPage: function(roomName) {
    //let roomName = $(event.target).attr("data-id");
    socket.emit("leaveRoom", roomName);
    let targetText = 'article[data-id="' + roomName + '"]';
    $(targetText).remove();
  }
};
