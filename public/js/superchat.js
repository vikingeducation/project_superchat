"use strict";
$(() => {
	const socket = io();
	const loginArea = $("#loginArea");
	const loginForm = $("#loginForm");
	const loginField = $("#loginField");

	const chatArea = $("#chatArea");
	const chatForm = $("#chatForm");
	const chatField = $("#chatField");

	const loginSignout = $("#loginSignout");
	const chatTrail = $("#chatTrail");

	//allow 'enter' key === hitting submit button
	loginForm.keypress(event => {
		const ENTER_KEY = 13;
		if (event.which === ENTER_KEY) {
			event.preventDefault();
			socket.emit("new login", loginField.val(), data => {
				if (data) {
					loginArea.hide();
					chatArea.css("display", "flex");
				}
			});
			loginField.val("");
			return false;
		}
	});

	//allow 'enter' key === hitting submit button
	chatForm.keypress(event => {
		const ENTER_KEY = 13;
		if (event.which === ENTER_KEY) {
			event.preventDefault();
			socket.emit("new message", chatField.val());
			chatField.val("");
			return false;
		}
	});

	chatForm.submit(() => {
		socket.emit("new message", chatField.val());
		chatField.val("");
		return false;
	});

	//create message
	socket.on("new message", (msg, username) => {
		chatTrail.prepend($("<hr>"));
		chatTrail.prepend(
			$('<h6 class="card-subtitle mb-2 text-muted"></h6>').text(msg)
		);
		chatTrail.prepend($('<h5 class="card-title"></h5>').text(username));
	});

	//write username to upper right
	socket.on("new login", username => {
		let myText = `Not ${username}? Sign Out`;
		loginSignout.html(myText);
	});
});
