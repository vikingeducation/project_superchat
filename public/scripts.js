$(chat);
// global socket for testing
var socket = io.connect('http://localhost:3000');

function chat() {
  //let socket = io.connect("http:localhost/3000");

  // Add a new room to the page
  socket.on('addRoom', roomName => {
    actions.buildRoom(roomName);
  });

  // Add a new post to a room
  socket.on('addPost', messageObj => {
    actions.buildPost(messageObj);
  });

  // User submits a new post, build it!
  $('#rooms').on('click', 'button', event => {
    event.preventDefault();
    actions.newPost(event);
  });
}

let actions = {
  buildRoom: function(roomName) {
    // Create a room with some jQuery magics
    let article = $('<article>')
      .addClass('col-md-4 col-lg-3')
      .attr('data-id', roomName);
    let h = $('<h2>').text(roomName);
    let ul = $('<ul>');
    let form = $('<form>');
    let section = $('<section>').addClass('form-group');
    let label = $('<label>').attr('for', 'post');
    let text = $('<textarea>').attr('name', 'post');
    let button = $('<button>')
      .addClass('btn btn-submit post-button')
      .text('Post something plz')
      .attr('type', 'button');
    section.append(label).append(text);
    form.append(section).append(button);
    article.append(h).append(ul).append(form);
    $('#rooms').append(article);
  },
  buildPost: function(messageObj) {
    // Create a post with some jQuery magics
    let li = $('<li>');
    let title = $('<h3>').text(messageObj.author);
    let body = $('<p>').text(messageObj.message);
    li.append(title).append(body);
    let targetText = '[data-id="' + messageObj.roomName + '"]';
    $(targetText).children('ul').append(li);
  },
  newPost: function(event) {
    // Get post details, trigger server event
    let $target = $(event.target);
    let roomName = $target.closest('article').attr('data-id');
    let author = 'anon'; //change later
    let $textBox = $target.siblings('section').children('textarea');
    let message = $textBox.val();
    $textBox.val('');
    socket.emit('addPost', roomName, author, message);
  }
};

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
