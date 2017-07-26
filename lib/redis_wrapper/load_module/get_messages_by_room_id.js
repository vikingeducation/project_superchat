const redisClient = require('redis').createClient();
const getModelData = require('./get_model_data');

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		// Get all messages by their room id.
		return getModelData('messages').then(_filterMessages.bind(roomId));
	} else {
		return Promise.reject(Error('Invalid room id.'));
	}
};

function _filterMessages(messages) {
	var _roomId = +this;
	return messages.filter(msg => {
		return +msg.room_id === _roomId;
	});
}
