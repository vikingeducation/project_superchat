$(document).ready(function() {
  var currentUrl = $(location).attr("href");
  console.log(location);
  var socket = io.connect(currentUrl);
  socket.on("connection", (data) => {
    console.log("We got connected!");
  });
});
