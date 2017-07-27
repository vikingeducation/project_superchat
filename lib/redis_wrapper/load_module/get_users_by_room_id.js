const redisClient = require('redis').createClient();
const getModelData = require('./get_model_data');

const _getUsersByRoom = roomId => users => {
	console.log(users.filter(user => +user.room_id === +roomId));
	return users
		.filter(user => +user.room_id === +roomId)
		.sort((a, b) => a.username > b.username);
};

module.exports = function(roomId) {
	// console.log(roomId, 'asjsdhfkjdhfk');
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getModelData('users').then(_getUsersByRoom(roomId));
	}
};
