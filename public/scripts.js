$(handle);
// global socket for testing
const socket = io.connect("http://localhost:3000");

function handle() {
  //let socket = io.connect("http:localhost/3000");

  // Show login form if user is not logged in
  let userName = document.cookie.superChatUsername;
  if (!userName) {
    $("#login").show();
  } else {
    actions.logIn(userName);
  }

  // Handle login submit
  $("#login").on("click", "button", event => {
    event.preventDefault();
    let userName = $("#login input").val();
    socket.emit("checkUsername", userName);
  });
  $("#login").on("keydown", "input", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      let userName = $("#login input").val();
      socket.emit("checkUsername", userName);
    }
  });

  // Handle bad username
  socket.on("invalidUserName", () => {
    $("#login input").val("");
    alert("Username already taken. Try Again.");
  });

  // Log in handler
  socket.on("validUserName", userName => {
    $("#login").hide();
    actions.logIn(userName);
  });

  // Log out hander
  $("#userStuff").on("click", "button", event => {
    // Remove Rooms
    // $("#rooms").children().each(child => {
    //   $(child).delete();
    // });
    $("#rooms").empty();
    $("#login").show();
    $("#userStuff").hide();
    //document.cookie.superChatUsername = "";
    // let name = getName();
    let name = "wilbur";
    socket.emit("logOut", name);
  });

  // Add a new room to the page
  socket.on("addRoom", roomName => {
    actions.buildRoom(roomName);
  });

  // Add a new post to a room
  socket.on("addPost", messageObj => {
    //console.log(messageObj);
    actions.buildPost(messageObj);
  });

  // User submits a new post, build it!
  $("#rooms").on("click", "button", event => {
    event.preventDefault();
    actions.newPost(event);
  });
}

let actions = {
  buildRoom: function(roomName) {
    // Create a room with some jQuery magics
    let article = $("<article>")
      .addClass("col-sm-6 col-md-4 col-lg-3")
      .attr("data-id", roomName);
    let h = $("<h2>").text(roomName);
    let ul = $("<ul>");
    let form = $("<form>");
    let section = $("<section>").addClass("form-group");
    let label = $("<label>").attr("for", "post").text("Make a new post:");
    let text = $("<textarea>").attr("name", "post").addClass("form-control");
    let button = $("<button>")
      .addClass("btn btn-submit post-button")
      .text("Post something plz")
      .attr("type", "button");
    section.append(label).append(text);
    form.append(section).append(button);
    article.append(h).append(form).append(ul);
    $("#rooms").append(article);
  },
  buildPost: function(messageObj) {
    // Create a post with some jQuery magics
    let li = $("<li>");
    let title = $("<h3>").text(messageObj.author);
    let body = $("<p>").text(messageObj.message);
    li.append(title).append(body);
    let targetText = '[data-id="' + messageObj.roomName + '"]';
    console.log(targetText);
    $(targetText).children("ul").prepend(li);
  },
  newPost: function(event) {
    // Get post details, trigger server event
    let $target = $(event.target);
    let roomName = $target.closest("article").attr("data-id");
    // let author = getName();
    let author = "wilbur";
    let $textBox = $target.siblings("section").children("textarea");
    let message = $textBox.val();
    $textBox.val("");
    socket.emit("addPost", roomName, author, message);
  },
  logIn: function(userName) {
    $("#login input").val("");
    $("#login").hide();
    let $userStuff = $("#userStuff");
    $userStuff.show();
    $userStuff.find("h3").text(userName);
    document.cookie = "superChatUsername=" + userName;
  }
};

function getName() {
  let cookieArr = decodeURIComponent(document.cookie).split(":");
  let userNameArr = cookieArr.filter(el => {
    return el.includes("superChatUsername");
  });
  return userNameArr[0].replace("superChatUsername=", "");
}
