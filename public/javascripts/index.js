$(document).ready(() => {
  var socket = io.connect;


  let q = {
    $login: $("#login"),
    $post: $("#post"),
    $join: $(".join"),
    $exit: $(".exit"),
    $create: $("#create")
  }

  var currentRoom;

  q.login.click((event)=>{
    let name = event.target.val();
    // works?
    socket.emit('login', name)
  })

  q.join.click((event)=>{
    var room = event.target.html()
    socket.emit("joined room", room);
    currentRoom = room;
  })

  q.exit.click((event)=>{
    var room = event.target.val();
    socket.emit("exited room", room)
    currentRoom = "";
  })

  q.post.click((event) => {
    //get room, user, msg
    socket.emit("newMessage", )
  }

  q.create.click((event) => {
    $('create-text').val = let room;
    socket.emit("created room", {room})
  }


  socket.on("room joined", ()=>{
    //display [room]

  })

  socket.on("room exited", ()=>{
    //hide [room], display room options

  })

  socket.on("room created", ()=>{
    //append room with jquery

  })

  socket.on("message saved", ()=>{
    //append message with jquery

  })

});
