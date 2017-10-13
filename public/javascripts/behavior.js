$(document).ready(() => {
  $('#new-chatroom').click(() => {
    $('#newChat').modal('show');
  });

  $('#logout-link').click((e) => {
    e.preventDefault();
    $('#logout-form').submit();
  });
});
