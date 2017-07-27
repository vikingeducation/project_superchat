$(_pageInit);

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	socket.emit('leave_room', {
		id: 4,
		user_id: 11
	});

	socket.on('room_left', userList => {
		console.log(userList);
	});

	// Assign event handlers.
	socket.on('message_sent', msgObj => {
		let $el = $('<h6>', {
			html: `<strong>${msgObj.username}:</strong> ${msgObj.body}`
		});
		$('#message-container').append($el);
	});

	$('#message-form').on('submit', function(e) {
		let message = $('#message-input').val();
		socket.emit('send_message', {
			body: message,
			user_id: readCookie('user_id'),
			room_id: 0
		});
		e.preventDefault();
	});
}
