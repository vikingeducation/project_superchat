$(login);

function login() {
  //send req to server, to check if I'm logged in
  const id = socket.id;
  $.get("/check_login/" + id);

  // Handle login form submit
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
    logInActions.logIn(userName);
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
}

logInActions = {
  logIn: function(userName) {
    $("#login input").val("");
    $("#login").hide();
    let $userStuff = $("#userStuff");
    $userStuff.show();
    $userStuff.find("h3").text(userName);
  }
};
