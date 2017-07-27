$(_pageInit);

let _inChatRoom = false;

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	// Get user id and current room id.
	let userId = readCookie('user_id');
	let currentRoomId = $('#chatroom-panel').data('room-id');

	const $messageContainer = $('#message-container');
	const $usersContainer = $('#users-container');

	$('#room-list').on('click', 'a.list-group-item', function(e) {
		let $target = $(e.target);

		// Get the id of the room.
		let roomId = $target.data('room-id');

		// Clear active flag on all rooms,
		// set active flag on selected room.
		$('#room-list a.list-group-item').removeClass('active');
		$target.addClass('active');

		// Emit event to change and leave rooms.

		if (_inChatRoom) {
			_inChatRoom = false;
		}
		if (!_inChatRoom) {
			new Promise(resolve => {
				socket.emit('join_room', {
					id: roomId,
					old_id: currentRoomId,
					user_id: userId
				});
				currentRoomId = roomId;
				$('#message-form').removeClass('hidden');
				_inChatRoom = true;
				resolve();
			}).then(() => {
				//Ajax our new chat room.
				$.ajax(`/room/${currentRoomId}`, {
					context: $messageContainer
				}).done(function(data) {
					this.html(data);
				});
			});
		}
	});

	socket.on('room_left', roomData => {
		$usersContainer.empty();
		roomData.users.forEach(user => {
			$usersContainer.append(`<li>${user.username}</li>`);
		});
	});

	socket.on('room_joined', roomData => {
		if (roomData.roomId !== currentRoomId) return;
		$usersContainer.empty();

		roomData.users.forEach(user => {
			$usersContainer.append(`<li>${user.username}</li>`);
		});
	});

	$('#message-form').on('submit', function(e) {
		let $msgInput = $('#message-input');
		let msg = $msgInput.val();

		socket.emit('send_message', {
			body: msg,
			user_id: userId,
			room_id: currentRoomId
		});

		$msgInput.val('');
		e.preventDefault();
	});

	socket.on('message_created', msgObj => {
		let $msgElement = $('<article>', {
			id: msgObj.id,
			class: 'message'
		});
		$msgElement.append(
			$('<strong>', {
				text: `${msgObj.username}: `
			}).add(
				$('<span>', {
					text: `${msgObj.body}`
				})
			)
		);

		$('#messages-block').append($msgElement);
	});

	window.onbeforeunload = function(event) {
		socket.emit('leave_room', {
			id: currentRoomId,
			user_id: userId
		});
	};
}
