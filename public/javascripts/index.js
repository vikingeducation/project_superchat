$(document).ready(() => {
  $(".chatroom-div").hide();
  $(".exit").hide();

  if ($("#header").html().split(" ").slice(1).join(' ') === "Anonymous") {
    $("#create-form").hide();
    $(".chatroom").hide();
  }

  var socket = io.connect("localhost:3000");

  let q = {
    $login: $("#login"),
    $post: $("#post"),
    $join: $(".join"),
    $exit: $(".exit"),
    $create: $("#create")
  };

  var currentRoom;
  var createdRoom;

  q.$login.click(() => {
    $(".chatroom").show();
  });

  q.$join.click(event => {
    var room = $(event.target).html().split(" ").slice(1).join(" ");
    currentRoom = room;
    $(`#${createdRoom}`).hide();
    $('.buttons').hide();
    $(`#${currentRoom}-buttons`).show();
    $(".chatroom-div").hide();
    $(`#${currentRoom}`).show();
    $(`#${currentRoom}-post`).show();
    $(`#exit-${currentRoom}`).show();
  });

  q.$exit.click(event => {
    var room = $(event.target).html().split(" ").slice(1).join(" ");
    $(".chatroom-div").hide();
    $(`#${currentRoom}`).hide();
    $('.exit').hide();
    $('.buttons').show();
    currentRoom = "";
  });

  q.$post.click(event => {
    let user =
      decodeURIComponent(document.cookie)
        .split(" ")
        .filter(el => {
          el.slice(0, 3) === "user";
        })
        .join("")
        .split("=")[1] || "Anonymous";
    let room = currentRoom;
    let message = $(`#${currentRoom}-post`).val();
    let msgData = [user, message, room];
    socket.emit("newMessage", msgData);
  });

  q.$create.click(event => {
    if ($("#create-text").val().split(" ").length > 1) {
      alert("No spaces please.");
      return;
    }
    let room = $("#create-text").val();
    socket.emit("created room", room);
    createdRoom = room;
  });

  // socket.on("room joined", ()=>{
  //   //display [room]

  // })

  // socket.on("room exited", ()=>{
  //   //hide [room], display room options
// `<div class='chatroom col-xs-10 offset-xs-1'><h1>${thisRoom}</h1><button class='join btn btn-primary'>Join ${thisRoom}</button><button id="exit-${thisRoom}" class='exit btn btn-warning'>Leave Room</button><div class='chatroom-div hidden' id='${thisRoom}'><h2>Posts: 0</h2><form class='form-group'><label for='post'>Post a Message</label><input name='post' class='form-group' type='text' id='${thisRoom}-post'></div><button class='post btn btn-success' type='button'>Post</button></form></div></div>`
  //ensure server emits room
  socket.on("room created", () => {
    let thisRoom = createdRoom;
    $(
      `<div class="chatroom col-xs-10 offset-xs-1">
            <div class="buttons" id="${thisRoom}-buttons">
              <h1>${thisRoom}</h1>
              <button class="join btn btn-primary">Join ${thisRoom}</button>
              <button id="exit-${thisRoom}" class="exit btn btn-warning">Leave Room</button>
            </div>
            <div class="chatroom-div" id= ${thisRoom}>
              <h2>Posts: {{post}}</h2>
              <form>
                <div class="form-group">
                  <label for="post" class="form-group" type="text" id="${thisRoom}-post">
                    <input type="text" class="form-group" name="post" id="${thisRoom}-post">
            </div>
            <button class="post btn btn-success" type="button">Post</button>
          </form>
  </div>
</div>`
    ).appendTo($("#chats-container"));
    $(".chatroom-div").hide();
    $(`#exit-${thisRoom}`).hide();
    $('.post').hide();
    //re-find .join
    q.$join = $(".join");
  });

  socket.on("message saved", data => {
    let room = data[2];
    let user = data[0];
    let message = data[1];
    $(
      `<div class='individual-post'><p>${message}</p><p>Posted by <strong>${user}</strong></p></div>`
    ).appendTo($(".chatroom-div"));
    // make .chatroom-div unique
  });
});
