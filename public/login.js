$(() => {
  loginClient.init();
  loginServer.init();
});

// Actions intitiated by the client
let loginClient = {
  init: () => {
    // Send req to server, to check if I'm logged in
    $.get("/check_login/" + socket.id);
    // Handle user input
    $("#login").on("click", "button", loginClient.handleIn);
    $("#login").on("keydown", "input", loginClient.handleInEnter);
    $("#userStuff").on("click", "button", loginClient.handleOut);
  },
  handleIn: event => {
    event.preventDefault();
    let userName = $("#login input").val();
    $.get(`/login/${socket.id}/${userName}`);
  },
  handleInEnter: event => {
    if (event.keyCode === 13) loginClient.handleIn(event);
  },
  handleOut: event => {
    $("#rooms").empty();
    $("#userStuff").hide();
    $("#roomsList").hide();
    $("#roomsListForm").hide();
    $("#login").show();
    $.get("/logout");
  }
};

// Actions initiated by the server
let loginServer = {
  init: () => {
    socket.on("invalidUserName", loginServer.handleInvalid);
    socket.on("validUserName", loginServer.handleValid);
  },
  handleInvalid: () => {
    $("#login input").val("");
    alert("Username already taken. Try Again.");
  },
  handleValid: userName => {
    $("#login input").val("");
    $("#login").hide();
    $("#roomsList").show();
    $("#roomsListForm").show();
    $("#userStuff").show();
    $("#userStuff h3").text(userName);
    socket.emit("registerUser", userName);
  }
};
