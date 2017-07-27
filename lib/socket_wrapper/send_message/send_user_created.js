const io = require("socket.io");
const { getUsers } = require("../../redis_wrapper/load_module");

module.exports = function(userObj) {
	// Get the newly created user's id from redis.
	getUsers().then(users => {
		let userId = users.find(user => user.username === userObj.username).id;
		userObj.id = userId;

		console.log(
			`New message: User data was saved! [ UserID: ${userObj.username}, RoomID: ${userObj.password} ]`
		);

		io.emit("user_created", userObj);
	});
};
