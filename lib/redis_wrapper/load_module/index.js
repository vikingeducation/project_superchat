const getModelData = require("./get_model_data");

module.exports = {
	getUsers: id => getModelData("users", id),
	getMessages: id => getModelData("messages", id),
	getRooms: id => getModelData("rooms", id),
	getMessagesByRoomId: require("./get_messages_by_room_id"),
	getUsersByRoomId: require("./get_users_by_room_id")
};
