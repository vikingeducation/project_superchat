let redisClient = require('redis');

if (process.env.ENV_NODE && process.env.ENV_NODE === 'production') {
	redisClient = redisClient.createClient(
		'redis://h:pb4fcc90a203598d8db9834efcc0c67a02944a321958a99d9ec5b668458348f30@ec2-52-3-6-123.compute-1.amazonaws.com:31369'
	);
} else {
	redisClient = redisClient.createClient();
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
