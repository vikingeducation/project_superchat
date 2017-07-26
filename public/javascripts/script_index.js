$(_pageInit);

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	// Assign event handlers.
	socket.on('message_sent', data => {
		let $el = $('<h6>', { text: `${data.body}` });

		$('#message-container').append($el);
	});

	$('#message-form').on('submit', function(e) {
		let message = $('#message-input').val();
		socket.emit('send_message', {
			body: message,
			user_id: 0,
			room_id: 0
		});
		e.preventDefault();
	});
}
