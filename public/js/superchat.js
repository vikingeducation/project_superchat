"use strict";
$(() => {
	const socket = io();
	const loginForm = $("#loginForm");
	const loginField = $("#loginField");
	const chatForm = $("#chatForm");
	const chatField = $("#chatField");
	const chatTrail = $("#chatTrail");

	//allow 'enter' key === hitting submit button
	loginForm.keypress(event => {
		const ENTER_KEY = 13;
		if (event.which === ENTER_KEY) {
			event.preventDefault();
			socket.emit("new login", loginField.val());
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
	socket.on("new message", (msg, name) => {
		chatTrail.prepend($("<hr>"));
		chatTrail.prepend(
			$('<h6 class="card-subtitle mb-2 text-muted"></h6>').text(msg)
		);
		chatTrail.prepend($('<h5 class="card-title"></h5>').text(name));
	});
});
