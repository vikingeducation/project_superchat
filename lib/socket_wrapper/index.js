const io = require("socket.io");

const { saveMessage, saveUser } = require("../redis_wrapper").saveModule;
const { userExists, getUsers } = require("../redis_wrapper").loadModule;
const { hashSync: encodePassword } = require("bcryptjs");

const { sendUserCreated, sendMessageCreated } = require("./send_message");
const { handleNewUser, handleNewMessage } = require("./receive_message");

const EVENT_SEND_MESSAGE = "send_message";
const EVENT_NEW_USER = "new_user";
const EVENT_ERROR_USER_EXISTS = "error_user_exists";
const MSG_CONNECTION_CONFIRM = "New connection request granted";

module.exports = client => {
	console.log(MSG_CONNECTION_CONFIRM);

	// Assign event handlers.
	// Messages
	client.on(EVENT_SEND_MESSAGE, msgObj => {
		handleNewMessage(msgObj).then(sendMessageCreated).catch(err => {
			console.log(err.stack);
		});
	});

	// Users
	client.on(EVENT_NEW_USER, userObj => {
		handleNewUser(userObj).then(sendUserCreated).catch(userObj => {
			console.log(io.emit, "???????");
			io.emit(EVENT_ERROR_USER_EXISTS, userObj);
		});
	});
};
