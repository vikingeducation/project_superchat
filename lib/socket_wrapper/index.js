const { saveMessage, saveUser } = require('../redis_wrapper').saveModule;
const { userExists, getUsers } = require('../redis_wrapper').loadModule;

const {
	sendUserCreated,
	sendMessageCreated,
	sendRoomCreated,
	sendRoomJoined,
	sendRoomLeft
} = require('./send_message');
const {
	handleNewUser,
	handleNewMessage,
	handleNewRoom,
	handleJoinRoom,
	handleLeaveRoom
} = require('./receive_message');

// Generic constants
const MSG_CONNECTION_CONFIRM = 'New connection request granted';

// Event mesages
const EVENT_SEND_MESSAGE = 'send_message';

// Event users
const EVENT_NEW_USER = 'new_user';
const EVENT_ERROR_USER_EXISTS = 'error_user_exists';

// Event rooms
const EVENT_NEW_ROOM = 'new_room';
const EVENT_JOIN_ROOM = 'join_room';
const EVENT_LEAVE_ROOM = 'leave_room';
const EVENT_ERROR_ROOM_EXISTS = 'error_room_exists';

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
		handleNewMessage(msgObj).then(sendMessageCreated(io));
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

	client.on(EVENT_JOIN_ROOM, roomObj => {
		handleLeaveRoom({
			id: roomObj.old_id,
			user_id: roomObj.user_id
		}).then(sendRoomLeft(io));
		handleJoinRoom(roomObj).then(sendRoomJoined(io));
	});

	client.on(EVENT_LEAVE_ROOM, roomObj => {
		handleLeaveRoom(roomObj).then(sendRoomLeft(io));
	});
};
