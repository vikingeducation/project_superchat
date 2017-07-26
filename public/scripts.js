$(chat);
var socket = io.connect("http://localhost:3000");
function chat() {
  //let socket = io.connect("http:localhost/3000");
  socket.on("addRoom", roomName => {
    //create a room with some jQuery magics
    let article = $("<article>")
      .addClass("col-md-4 col-lg-3")
      .attr("id", roomName);
    let h = $("<h2>").text(roomName);
    let ul = $("<ul>");
    let form = $("<form>");
    let section = $("<section>").addClass("form-group");
    let label = $("<label>").attr("for", "post");
    let text = $("<textarea>").attr("name", "post");
    let button = $("<button>")
      .addClass("btn btn-submit post-button")
      .text("Post something plz");
    section.append(label).append(text);
    form.append(section).append(button);
    article.append(h).append(ul).append(form);
    $("#rooms").append(article);
  });
  socket.on("addPost", messageObj => {});
  $(".post-button").on("click", event => {
    event.preventDefault();
    let roomName = $(event.target).closest("article").attr("id");
    let author = "anon"; //change later
    let message = $(event.target)
      .siblings("section")
      .children("textarea")
      .val();
    socket.emit("addPost", (roomName, author, message));
  });
}
//
// <article id="" class="col-md-4 col-lg-3">
//   <h2>Da chat Room</h2>
//   <ul>
//
//   </ul>
// <form>
//<input type=text>
// </article>
// <section class='form-group'>
//   <label for='post'>
//   <textarea name='post'>
// </section>
// <button class='btn btn-submit post-button'>
//

// Room:room-name
