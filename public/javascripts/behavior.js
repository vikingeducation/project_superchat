$(document).ready(() => {
  $('#new-chatroom').click(() => {
    $('#newChat').modal('show');
  });

  $('#logout-link').click((e) => {
    e.preventDefault();
    $('#logout-form').submit();
  });

  $('.room-select').click((room) => {
    var id = room.target.id;
    var roomName = id.slice(5).split('-').join(' ');

    document.cookie = `chatRoom=${ roomName }`;
    document.location = '/';
  });
});
