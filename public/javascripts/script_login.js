$(_pageInit);

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect('http://localhost:3000');

	// Assign event handlers.
	socket.on('', data => {});

	$('#login-form').on('submit', function(e) {
		console.log(document.cookie);
		e.preventDefault();
	});
}
