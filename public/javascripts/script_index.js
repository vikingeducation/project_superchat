$(_pageInit);

let _inChatRoom = false;

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	const $messageContainer = $('#message-container');
	const $usersContainer = $('#users-container');

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
		if (_inChatRoom) {
			socket.emit('leave_room', {
				id: roomId,
				user_id: userId
			});
			_inChatRoom = false;
		}
		if (!_inChatRoom) {
			socket.emit('join_room', {
				id: roomId,
				user_id: userId
			});
			$('#message-form').removeClass('hidden');
			_inChatRoom = true;
		}
		//Ajax our new chat room.
		$.ajax(`/room/${roomId}`, {
			context: $messageContainer
		}).done(function(data) {
			this.html(data);
		});
	});

	socket.on('room_joined', userList => {
		$usersContainer.empty();
		userList.forEach(user => {
			$usersContainer.append(`<li>${user.username}</li>`);
		});
	});
}
