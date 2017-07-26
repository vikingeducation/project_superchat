const redisClient = require('redis').createClient();
const getMessagesByRoomId = require('./get_messages_by_room_id');
const getModelData = require('./get_model_data');

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getMessagesByRoomId(roomId).then(_getUsersFromMessages);
	}
};

function _getUsersFromMessages(messages) {
	let userIds = [];

	// Map over messages array and convert it
	// to an array of user ids.
	messages
		.map(msg => {
			return msg.user_id;
		})
		.forEach(userId => {
			if (userIds.includes(userId)) {
				return;
			}

			userIds.push(userId);
		});

	// userIds is now an array of user ids.
	return getModelData('users', userIds);
}
