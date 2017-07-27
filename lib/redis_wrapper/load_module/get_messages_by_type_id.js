const redisClient = require('redis').createClient();
const getModelData = require('./get_model_data');

module.exports = function(type, typeId) {
	if (typeId !== undefined && !isNaN(+typeId)) {
		// Get all messages by their type id.
		return getModelData('messages').then(_filterMessages(type, typeId));
	} else {
		return Promise.reject(Error('Invalid type id.'));
	}
};

const _filterMessages = (type, typeId) => messages => {
	type = type.slice(0, -1);
	return messages.filter(msg => {
		return +msg[`${type}_id`] === typeId;
	});
};
