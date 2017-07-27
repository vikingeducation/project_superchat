const { saveMessage } = require("../../redis_wrapper/save_module");

// _handleNewMessage
module.exports = function(msgObj) {
	// {
	// 	body: string,
	// 	user_id: integer,
	// 	room_id: integer
	// }

	// Set the gmt_created property.
	msgObj.gmt_created = new Date().getTime();

	return saveMessage(msgObj);
};
