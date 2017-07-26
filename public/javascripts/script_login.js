$(_pageInit);

function _pageInit() {
	// Connect to our backend.
	const socket = io.connect("http://localhost:3000");

	// Assign event handlers.
	socket.on("user_created", userObj => {
		// document.cookie += `;username=${userObj.username}`;
		createCookie("username", userObj.username, 1);
		window.location = "/";
	});

	$("#login-form").on("submit", function(e) {
		let username = $("#username-input").val();
		socket.emit("new_user", { username: username, password: "12345" });

		e.preventDefault();
	});
}

function createCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}
