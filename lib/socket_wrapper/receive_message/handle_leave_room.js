const { getUsersByRoomId } = require('../../redis_wrapper').loadModule;
const { updateUserData } = require('../../redis_wrapper').saveModule;

module.exports = function(roomObj) {
	return updateUserData(roomObj.user_id, 'room_id', -1)
		.then(() => roomObj.id)
		.then(roomId => {
			return getUsersByRoomId(roomId).then(users => {
				return {
					roomId: roomId,
					users: users
				};
			});
		});
};
