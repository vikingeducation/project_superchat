const redisClient = require('redis').createClient();
const getModelData = require('./get_model_data');

const _getUsersByRoom = roomId => users => {
	return users
		.filter(user => +user.room_id === roomId)
		.sort((a, b) => a.username > b.username);
};

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getModelData('users').then(_getUsersByRoom(roomId));
	}
};
