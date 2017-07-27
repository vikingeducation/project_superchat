const io = require('socket.io');
const { saveMessage, saveUser } = require('../redis_wrapper').saveModule;
const { userExists, getUsers } = require('../redis_wrapper').loadModule;
const { hashSync: encodePassword } = require('bcryptjs');

const { _sendUserCreated } = require('./send_message');
const { _handleNewUser } = require('./receive_message');

module.exports = client => {
	console.log('New connection request granted');

	// Assign event handlers.
	// Messages
	client.on('send_message', _handleSendMessage);

	// Users
	client.on('new_user', userObj => {
		_handleNewUser(userObj).then(_sendUserCreated, userObj => {
			io.emit('error_user_exists', userObj);
		});
	});
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
