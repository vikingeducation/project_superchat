const redisClient = require('redis').createClient();
const getModelData = require('./get_model_data');

module.exports = function(userId) {
	if (userId !== undefined && !isNaN(+userId)) {
		// Get all messages by their user id.
		return getModelData('messages').then(_filterMessages.bind(userId));
	} else {
		return Promise.reject(Error('Invalid user id.'));
	}
};

function _filterMessages(messages) {
	var _userId = +this;
	return messages.filter(msg => {
		return +msg.user_id === _userId;
	});
}
