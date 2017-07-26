$(_pageInit);

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	// Assign event handlers.
	socket.on('user_created', userObj => {
		createCookie('username', userObj.username, 1);
		createCookie('user_id', userObj.id, 1);
		window.location = '/';
	});

	socket.on('error_user_exists', () => {
		window.alert('Error, user exists already, please try again!');
	});

	$('#login-form').on('submit', function(e) {
		let username = $('#username-input').val();
		socket.emit('new_user', { username: username, password: '12345' });

		e.preventDefault();
	});
}
