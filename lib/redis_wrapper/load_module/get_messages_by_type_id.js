let redisClient = require('redis');

if (process.env.ENV_NODE && process.env.ENV_NODE === 'production') {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
} else {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
}

const getModelData = require('./get_model_data');

const _filterMessages = (type, typeId) => messages => {
	type = type.slice(0, -1);
	return messages.filter(msg => {
		return +msg[`${type}_id`] === +typeId;
	});
};

module.exports = function(type, typeId) {
	if (typeId !== undefined && !isNaN(+typeId)) {
		// Get all messages by their type id.
		return getModelData('messages').then(_filterMessages(type, typeId));
	} else {
		return Promise.reject(Error('Invalid type id.'));
	}
};
