const { getUsers } = require("../../redis_wrapper/load_module");

const _getUserId = username => users => {
	return users.find(user => user.username === username).id;
};

module.exports = io => userObj => {
	// Get the newly created user's id from redis.
	getUsers().then(users => {
		userObj.id = _getUserId(userObj.username)(users);

		console.log(
			`New message: User data was saved! [ UserID: ${userObj.username}, RoomID: ${userObj.password} ]`
		);

		io.emit("user_created", userObj);
	});
};
