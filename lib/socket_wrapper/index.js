const io = require('socket.io');
const { saveMessage, saveUser } = require('../redis_wrapper').saveModule;
const { userExists, getUsers } = require('../redis_wrapper').loadModule;
const { hashSync: encodePassword } = require('bcryptjs');

module.exports = client => {
	console.log('New connection request granted');

	// Assign event handlers.
	// Messages
	client.on('send_message', _handleSendMessage);

	// Users
	client.on('new_user', _handleNewUser);
};

function _handleSendMessage(msgObj) {
	// {
	// 	body: string,
	// 	user_id: integer,
	// 	room_id: integer
	// }

	// Set the gmt_created property.
	msgObj.gmt_created = new Date().getTime();

	saveMessage(msgObj).then(() => {
		console.log(
			`New message: [ UserID: ${msgObj.user_id}, RoomID: ${msgObj.room_id}, Body: ${msgObj.body} ]`
		);

		getUsers(msgObj.user_id).then(user => {
			msgObj.username = user[0].username;
			io.emit('message_sent', msgObj);
		});
	});
}

function _handleNewUser(userObj) {
	userExists(userObj.username).then(exists => {
		if (exists) {
			io.emit('error_user_exists');
		} else {
			userObj.password = encodePassword(userObj.password);
			saveUser(userObj).then(() => {
				console.log(
					`New message: User data was saved! [ UserID: ${userObj.username}, RoomID: ${userObj.password} ]`
				);

				// Get the newly created user's id from redis.
				getUsers().then(users => {
					let userId = users.find(user => user.username === userObj.username)
						.id;
					userObj.id = userId;
					io.emit('user_created', userObj);
				});
			});
		}
	});
}
