const redisClient = require('redis').createClient();

const dataMap = {
	users: ['id', 'username', 'password'],
	message: ['id', 'body', 'gmt_created', 'user_id', 'room_id'],
	rooms: ['id', 'name']
};

module.exports = function(type, data) {
	if (type === undefined || !Object.keys(data).every(dataMap[type].includes)) {
		return;
	}

	return redisClient.hsetAsync(`${type}:${data.id}`, data);
};
