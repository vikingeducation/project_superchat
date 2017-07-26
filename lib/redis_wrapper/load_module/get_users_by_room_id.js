const redisClient = require('redis').createClient();
const getMessagesByRoomId = require('./get_messages_by_room_id');

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getMessagesByRoomId(roomId).then(_getUsersFromMessages);
	}
};

function _getUsersFromMessages(messages) {
	return messages.filter(msg => {
		let users = [];
		getModelData('users').then(_filterUnique);
	});
}

function _filterUnique(users) {}
