const { saveMessage, saveUser } = require("../redis_wrapper").saveModule;
const { userExists, getUsers } = require("../redis_wrapper").loadModule;

const {
	sendUserCreated,
	sendMessageCreated,
	sendRoomCreated
} = require("./send_message");
const {
	handleNewUser,
	handleNewMessage,
	handleNewRoom
} = require("./receive_message");

// Generic constants
const MSG_CONNECTION_CONFIRM = "New connection request granted";

// Event mesages
const EVENT_SEND_MESSAGE = "send_message";

// Event users
const EVENT_NEW_USER = "new_user";
const EVENT_ERROR_USER_EXISTS = "error_user_exists";

// Event rooms
const EVENT_NEW_ROOM = "new_room";
const EVENT_ERROR_ROOM_EXISTS = "error_room_exists";

/*
	Main Page
 */
// new room created
// new user created

/*
	Room Page
 */
// user joins room
// user leaves room
// send message

module.exports = io => client => {
	console.log(MSG_CONNECTION_CONFIRM);

	// Assign event handlers.
	// Messages
	client.on(EVENT_SEND_MESSAGE, msgObj => {
		handleNewMessage(msgObj).then(sendMessageCreated(io)).catch(err => {
			console.log(err.stack);
		});
	});

	// Users
	client.on(EVENT_NEW_USER, userObj => {
		handleNewUser(userObj).then(sendUserCreated(io), userObj => {
			io.emit(EVENT_ERROR_USER_EXISTS, userObj);
		});
	});

	// Rooms
	client.on(EVENT_NEW_ROOM, roomObj => {
		handleNewRoom(roomObj).then(sendRoomCreated(io), roomObj => {
			io.emit(EVENT_ERROR_ROOM_EXISTS, roomObj);
		});
	});
};
