$(document).ready(function() {
  var currentUrl = $(location).attr("href");
  console.log(location);
  var socket = io.connect(currentUrl);
  socket.on("connection", data => {
    console.log("We got connected!");
  });

  socket.on("new room", stringOHTML => {
    //create new tr element from data from server

    //find the rooms table
    //and append it to the end of the table
    $("#rooms tbody").append(stringOHTML);
  });

  $("#newRoom").submit(event => {
    console.log("emit event!");
    event.preventDefault();
    let newRoom = $(this).filter("input").val();
    console.log(newRoom);
    socket.emit("new room", newRoom);
    return false;
  });
});
