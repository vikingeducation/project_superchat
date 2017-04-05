$(document).ready(function() {
  
  var getCookies = function(){
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
      var pair = pairs[i].split("=");
      cookies[pair[0].trim()] = unescape(pair[1]).trim();
    }
    return cookies;
  };
  var theCookies = getCookies();
  console.log(`value of cookies.user ${ theCookies.user }`);
  console.log(`value of cookies.user ${ Object.keys(theCookies) }`);
  console.log(`document.cookies is ${ document.cookie }`);
  
  
  var currentUrl = $(location).attr("href");
  console.log(location);
  var socket = io.connect(currentUrl);
  socket.on("connection", data => {
    console.log("We got connected!");
    

    
    $('#messages tbody').append(data.messages);
    
    
    //get the data
    //populate the webpage
    //data.rooms is an array
    //forEach
    $("#rooms tbody").append(data.rooms);
  });

  socket.on("new room", stringOHTML => {
    //create new tr element from data from server

    //find the rooms table
    //and append it to the end of the table
    $("#rooms tbody").append(stringOHTML);
  });

  $("#newRoom").submit(event => {
    event.preventDefault();
    let newRoom = $("#chatroomID").val();
    socket.emit("new room", newRoom);
    return false;
  });

  socket.on("new message", stringOHTML => {
    $("#messages tbody").append(stringOHTML);
  });

  $("#newMessage").submit(event => {
    event.preventDefault();
    let newMessage = $("#message").val().trim();
    let usersName = theCookies.user || "Anon"; //Some function to get usersName
    let currentChatroom = $("#currentChatroom").val() || "default"; //Some function
    //name of user and name of current chatroom
    socket.emit("new message", { newMessage, usersName, currentChatroom });
    return false;
  });
});
