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
  //save to cookies
})

q.join.click((event)=>{
  var room = event.target.html()
  socket.emit("joined room", room);
  currentRoom = room;
})

q.exit.click((event)=>{
  var room = event.target.val();
  socket.emit("room left", room)
  currentRoom = "";
})

q.post.click((event)=>{
  //socket.emit "new message"
}

q.create.click((event)=>{
  //socket.emit "room created"
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
