const redisClient = require('redis').createClient(
	'redis://h:pb4fcc90a203598d8db9834efcc0c67a02944a321958a99d9ec5b668458348f30@ec2-52-3-6-123.compute-1.amazonaws.com:31369'
);
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
