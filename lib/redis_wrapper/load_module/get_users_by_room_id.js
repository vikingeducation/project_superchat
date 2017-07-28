let redisClient = require('redis');

if (process.env.ENV_NODE && process.env.ENV_NODE === 'production') {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
} else {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
}

const getModelData = require('./get_model_data');

const _getUsersByRoom = roomId => users => {
	if (!users || users.length === 0) return [];
	return users.filter(user => +user.room_id === +roomId);
};

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getModelData('users').then(_getUsersByRoom(roomId));
	}
};
