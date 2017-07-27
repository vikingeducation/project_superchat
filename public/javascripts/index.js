$(document).ready(() => {

  $('.chatroom-div').hide();

  var socket = io.connect;


  let q = {
    $post: $("#post"),
    $join: $(".join"),
    $exit: $(".exit"),
    $create: $("#create")
  }

  var currentRoom;

  q.join.click((event)=>{
    var room = $(event.target).html().split(' ').slice(1).join(' ');
    currentRoom = room;
    $('.chatroom-div').hide();
    $(`#${currentRoom}`).show();
    $(`#${currentRoom}-post`).show();
  })

  q.exit.click((event)=>{
    var room = $(event.target).html().split(' ').slice(1).join(' ');
    $('.chatroom-div').hide();
    $(`#${currentRoom}`).hide();
    currentRoom = "";
  })

  q.post.click((event) => {
    let user = decodeURIComponent(document.cookie).split(' ').filter(el=> {
      el.slice(0, 3) === 'user'
    }).join('').split('=')[1] || 'Anonymous'
    let room = currentRoom;
    let message = $(`#${currentRoom}-post`).val();
    let msgData = [user, message, room]
    socket.emit("newMessage", msgData)
  }

  q.create.click((event) => {
    let room = $('#create-text').val();
    socket.emit("created room", room)
  }


  // socket.on("room joined", ()=>{
  //   //display [room]

  // })

  // socket.on("room exited", ()=>{
  //   //hide [room], display room options

  })
//ensure server emits room
  socket.on("room created", (room) => {
    let thisRoom = Object.keys(room)[0]
    $(`<div class='chatroom col-xs-5 offset-xs-1'><h1>${thisRoom}</h1><button class='join btn btn-primary'>Join ${thisRoom}</button><div class='chatroom-div' id='${thisRoom}'><h2>Posts: 0</h2><form class='form-group'><label for='post'>Post a Message</label><input name='post' class='form-group' type='text' id='${thisRoom}-post'></div><button class='post btn btn-success' type='button'>Post</button></form></div><button class='exit btn btn-warning'>Leave Room</button></div>`).appendTo($('.container'))
    $('.chatroom-div').hide();
    //re-find .join
    q.$join = $('.join')
  })

  socket.on("message saved", (data) => {
    let room = data[2];
    let user = data[0];
    let message = data[1];
    $(`<div class='individual-post'><p>${message}</p><p>Posted by <strong>${user}</strong></p></div>`).appendTo($('.chatroom-div'));
    // make .chatroom-div unique
    })

  })

});
