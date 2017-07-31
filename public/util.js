const socket = io.connect("http://localhost:3000");

const templates = {
  roomButton: function(roomName) {
    return `
      <button class='btn btn-info room' data-id="${roomName}">
        ${roomName}
      </button>
    `;
  },
  message: function(messageObj) {
    return `
      <li>
        <h5>${messageObj.author}</h5>
        <h4>${messageObj.message}</h4>
      </li>
  `;
  },
  room: function(roomName) {
    return `
    <article class="col-sm-6 col-md-4 col-lg-3" data-id="${roomName}">
      <h2>${roomName}</h2>
      <button class="btn btn-warning leave" data-id="${roomName}">Leave Room</button>
      <button class="btn btn-danger delete" data-id="${roomName}">Delete Room</button>
      <form>
        <section class="form-group">
          <label for="post">Make a new post:</label>
          <input type="text" name="post" class="form-control"></input>
        </section>
        <button class="btn btn-success" type="button">Post something plz</button></form>
      <ul></ul>
    </article>
    `;
  }
};
