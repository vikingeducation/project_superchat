$(_pageInit);

let _inChatRoom = false;

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	$('#room-list').on('click', 'a.list-group-item', function(e) {
		let $target = $(e.target);

		// First get the user id.
		let userId = readCookie('user_id');

		// Get the id of the room.
		let roomId = $target.data('room-id');

		// Clear active flag on all rooms,
		// set active flag on selected room.
		$('#room-list a.list-group-item').removeClass('active');
		$target.addClass('active');

		// Emit event to change and leave rooms.
		if (inChatRoom) {
			socket.emit('leave_room', {
				id: roomId,
				user_id: userId
			});
		}
		socket.emit('join_room', {
			id: roomId,
			user_id: userId
		});

		// Ajax our new chat room.
		$.ajax();
	});

	// socket.on('room_left', userList => {
	// 	console.log(userList);
	// });
	//
	// // Assign event handlers.
	// socket.on('message_sent', msgObj => {
	// 	let $el = $('<h6>', {
	// 		html: `<strong>${msgObj.username}:</strong> ${msgObj.body}`
	// 	});
	// 	$('#message-container').append($el);
	// });
	//
	// $('#message-form').on('submit', function(e) {
	// 	let message = $('#message-input').val();
	// 	socket.emit('send_message', {
	// 		body: message,
	// 		user_id: readCookie('user_id'),
	// 		room_id: 0
	// 	});
	// 	e.preventDefault();
	// });
}
