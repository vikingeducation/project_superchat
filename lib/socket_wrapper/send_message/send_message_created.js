const io = require("socket.io");
const { getUsers } = require("../../redis_wrapper/load_module");

module.exports = io => msgObj => {
	getUsers(msgObj.user_id).then(user => {
		msgObj.username = user[0].username;

		console.log(
			`New message: [ UserID: ${msgObj.user_id}, RoomID: ${msgObj.room_id}, Body: ${msgObj.body} ]`
		);

		io.emit("message_sent", msgObj);
	});
};

// send stuff
