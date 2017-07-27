const redisClient = require('redis').createClient();
const Promise = require('bluebird');
// Data map to check for valid entries to be saved
const dataMap = {
	users: ['username', 'password'],
	messages: ['body', 'gmt_created', 'user_id', 'room_id'],
	rooms: ['name']
};

const _validateEntryData = data => type => {
	return Object.keys(data).every(key => dataMap[type].includes(key));
};

// Generic function which handles saving model data to redis.
module.exports = function(type, data) {
	// console.log(data, "whats this");
	if (type === undefined || typeof type !== 'string') {
		return Promise.reject(Error('Invalid argument type for type'));
	}
	if (!_validateEntryData(data)(type)) {
		return Promise.reject(
			Error('Incorrect data structure passed, aborting save.')
		);
	}

	// Increment our counter, then save our new entry.
	return redisClient.incrAsync(`counts:${type}`).then(newId => {
		data.id = newId;
		return redisClient.hmsetAsync(`${type}:${data.id}`, data);
	});
};
