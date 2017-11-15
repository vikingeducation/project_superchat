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
	const whoseOnline = $("#whoseOnline");
	const onlineCount = $("#onlineCount");

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
		let html = `Not ${username}? Sign Out`;
		loginSignout.html(html);
	});

	socket.on("get count", data => {
		let html =
			"Online  <span class='badge badge-pill badge-success'>" +
			data +
			"</span>";
		onlineCount.html(html);
	});

	socket.on("get logins", data => {
		let html = "";
		for (let i = 0; i < data.length; i++) {
			html +=
				"<a href='#' class='list-group-item list-group-item-action flex-column align-items-start'> <div class='d-flex w-100 justify-content-between'> <h5 class='mb-1'>" +
				data[i] +
				"</h5> </div> </a>";
		}
		whoseOnline.html(html);
	});
});
