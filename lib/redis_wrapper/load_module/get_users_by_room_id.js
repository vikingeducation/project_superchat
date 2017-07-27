const redisClient = require('redis').createClient();
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
