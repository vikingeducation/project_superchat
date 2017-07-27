const redisClient = require('redis').createClient();
const getMessagesByTypeId = require('./get_messages_by_type_id');
const getModelData = require('./get_model_data');

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getUsers().then(_getUsersByRoom);
	}
};

function _getUsersByRoom(messages) {
	let userIds = {};

	// Map over messages array and convert it
	// to a hash of user ids.
	messages
		.map(msg => {
			return msg.user_id;
		})
		.forEach(userId => {
			if (userIds[userId] !== undefined) {
				return;
			}
			userIds[userId] = true;
		});

	// userIds is now an array of user ids.
	return getModelData('users', Object.keys(userIds));
}
