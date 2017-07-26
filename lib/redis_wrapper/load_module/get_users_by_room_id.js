const redisClient = require("redis").createClient();
const getMessagesByRoomId = require("./get_messages_by_room_id");
const getModelData = require("./get_model_data");

module.exports = function(roomId) {
	if (roomId !== undefined && !isNaN(+roomId)) {
		return getMessagesByRoomId(roomId).then(_getUsersFromMessages);
	}
};

function _getUsersFromMessages(messages) {
	let userIds = [];

	messages
		.map(msg => {
			return msg.user_id;
		})
		.forEach(userId => {
			if (userIds.includes(userId)) {
				return;
			}

			userIds.push(userId);
		});

	return messages.filter(msg => {
		// let users = [];
		// getModelData("users").then(_filterUnique);
	});
}

function _filterUnique(users) {
	console.log(users);
}
